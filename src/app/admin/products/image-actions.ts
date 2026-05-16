'use server'

import { randomUUID } from 'node:crypto'
import { getAdminAccess } from '@/lib/admin/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const PRODUCT_IMAGES_BUCKET = 'product-images'
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const MIME_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const

type AllowedImageMime = keyof typeof MIME_EXTENSIONS

type UploadProductImageResult =
  | { success: true; url: string; path: string }
  | { success: false; error: string }

function isAllowedImageMime(value: string): value is AllowedImageMime {
  return Object.hasOwn(MIME_EXTENSIONS, value)
}

function safeProductFolder(productId: FormDataEntryValue | null): string | null {
  if (productId === null || productId === '') return 'temp'
  if (typeof productId !== 'string') return null
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId)
    ? productId
    : null
}

function storageError(): UploadProductImageResult {
  return {
    success: false,
    error: 'Image upload is not configured yet.',
  }
}

export async function uploadProductImageAction(
  formData: FormData
): Promise<UploadProductImageResult> {
  const access = await getAdminAccess()
  if (access.status === 'setup_required') {
    return storageError()
  }

  if (access.status !== 'ok') {
    return {
      success: false,
      error: 'You need admin access to upload images.',
    }
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return storageError()
  }

  const file = formData.get('image')
  if (!(file instanceof File) || file.size === 0) {
    return {
      success: false,
      error: 'Please choose an image to upload.',
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      success: false,
      error: 'Image size must be 5 MB or less.',
    }
  }

  if (!isAllowedImageMime(file.type)) {
    return {
      success: false,
      error: 'Only JPG, PNG or WebP images can be uploaded.',
    }
  }

  const folder = safeProductFolder(formData.get('productId'))
  if (!folder) {
    return {
      success: false,
      error: 'Invalid product image destination.',
    }
  }

  const extension = MIME_EXTENSIONS[file.type]
  const timestamp = Date.now()
  const random = randomUUID().replaceAll('-', '')
  const path = `products/${folder}/${timestamp}-${random}.${extension}`

  try {
    const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      return {
        success: false,
        error: 'Image upload failed. Please check Storage setup and try again.',
      }
    }
  } catch {
    return {
      success: false,
      error: 'Image upload failed. Please check Storage setup and try again.',
    }
  }

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path)
  if (!data.publicUrl) {
    return storageError()
  }

  return {
    success: true,
    url: data.publicUrl,
    path,
  }
}
