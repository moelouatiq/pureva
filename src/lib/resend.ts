import { Resend } from 'resend'
import type { Locale } from '@/types/locale'

export type OrderEmailData = {
  orderReference: string
  customerName: string
  customerEmail: string
  customerPhone: string
  country: string
  address: string
  productName: string
  quantity: number
  message?: string
  priceStatus: 'confirmed' | 'placeholder'
  unitPrice?: string
  subtotal?: string
  locale: Locale
  timestamp: string
  waFollowUpUrl: string
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px;font-weight:600;color:#4a5568;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:6px 12px;color:#1a202c;">${value}</td>
  </tr>`
}

function buildBusinessEmail(data: OrderEmailData): string {
  const priceRows =
    data.priceStatus === 'confirmed' && data.unitPrice && data.subtotal
      ? row('Prix unitaire', data.unitPrice) +
        row('Sous-total estimé', `${data.subtotal} <em style="color:#888;">(non facturé — commande à confirmer)</em>`)
      : row('Prix', '<em>À confirmer avec le client</em>')

  const msgRow = data.message
    ? row('Message', data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
    : ''

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:#f9f9f7;margin:0;padding:32px 16px;">
  <div style="max-width:580px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#1a3a2a;padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:20px;font-weight:700;">
        Nouvelle commande Pureva
      </h1>
    </div>
    <div style="padding:24px 32px;">
      <p style="margin:0 0 20px;color:#555;font-size:14px;">Reçu le ${data.timestamp}</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e8e4dc;border-radius:8px;overflow:hidden;">
        <tbody>
          ${row('Référence', `<strong>${data.orderReference}</strong>`)}
          ${row('Produit', `${data.productName} × ${data.quantity}`)}
          ${priceRows}
          <tr><td colspan="2" style="padding:0;border-top:1px solid #e8e4dc;"></td></tr>
          ${row('Nom', data.customerName)}
          ${row('Email', `<a href="mailto:${data.customerEmail}">${data.customerEmail}</a>`)}
          ${row('Téléphone', data.customerPhone)}
          ${row('Pays', data.country)}
          ${row('Adresse', data.address.replace(/\n/g, '<br>'))}
          ${msgRow}
          ${row('Langue', data.locale.toUpperCase())}
        </tbody>
      </table>
    </div>
    <div style="padding:16px 32px;background:#f9f9f7;border-top:1px solid #e8e4dc;">
      <p style="margin:0;font-size:12px;color:#888;">
        Répondre directement à ce message pour contacter le client.
      </p>
    </div>
  </div>
</body>
</html>`
}

function buildCustomerEmailFr(data: OrderEmailData): string {
  const priceInfo =
    data.priceStatus === 'confirmed' && data.unitPrice && data.subtotal
      ? `${data.unitPrice} × ${data.quantity} = ${data.subtotal} <em style="color:#888;">(estimatif)</em>`
      : `<em>Prix à confirmer</em>`

  const waSection = data.waFollowUpUrl
    ? `<p style="margin:20px 0 0;">
        <a href="${data.waFollowUpUrl}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
          Suivre par WhatsApp
        </a>
      </p>`
    : ''

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:#f9f9f7;margin:0;padding:32px 16px;">
  <div style="max-width:540px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#1a3a2a;padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:20px;font-weight:700;">
        Pureva — Demande de commande reçue
      </h1>
    </div>
    <div style="padding:28px 32px;color:#1a202c;">
      <p style="margin:0 0 12px;">Bonjour ${data.customerName},</p>
      <p style="margin:0 0 20px;color:#4a5568;">
        Nous avons bien reçu votre demande de commande. Voici un récapitulatif :
      </p>
      <div style="background:#f9f9f7;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0 0 6px;"><strong>Produit :</strong> ${data.productName} × ${data.quantity}</p>
        <p style="margin:0 0 6px;"><strong>Tarif :</strong> ${priceInfo}</p>
        <p style="margin:0;"><strong>Référence :</strong> <span style="font-family:monospace;">${data.orderReference}</span></p>
      </div>
      <p style="margin:0 0 8px;font-weight:600;color:#1a3a2a;">Prochaines étapes</p>
      <p style="margin:0 0 20px;color:#4a5568;">
        Nous vous contacterons prochainement pour confirmer la disponibilité,
        le montant final et les modalités de livraison.
      </p>
      <p style="margin:0;color:#4a5568;font-size:14px;">
        Des questions ? Répondez à cet email ou contactez-nous via WhatsApp.
      </p>
      ${waSection}
    </div>
    <div style="padding:16px 32px;background:#f9f9f7;border-top:1px solid #e8e4dc;">
      <p style="margin:0;font-size:12px;color:#888;">
        Pureva — soins capillaires naturels<br>
        Ce message est envoyé en réponse à votre demande de commande.
      </p>
    </div>
  </div>
</body>
</html>`
}

function buildCustomerEmailEn(data: OrderEmailData): string {
  const priceInfo =
    data.priceStatus === 'confirmed' && data.unitPrice && data.subtotal
      ? `${data.unitPrice} × ${data.quantity} = ${data.subtotal} <em style="color:#888;">(estimated)</em>`
      : `<em>Price to be confirmed</em>`

  const waSection = data.waFollowUpUrl
    ? `<p style="margin:20px 0 0;">
        <a href="${data.waFollowUpUrl}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
          Follow up on WhatsApp
        </a>
      </p>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:#f9f9f7;margin:0;padding:32px 16px;">
  <div style="max-width:540px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#1a3a2a;padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:20px;font-weight:700;">
        Pureva — Order request received
      </h1>
    </div>
    <div style="padding:28px 32px;color:#1a202c;">
      <p style="margin:0 0 12px;">Hello ${data.customerName},</p>
      <p style="margin:0 0 20px;color:#4a5568;">
        We have received your order request. Here is a summary:
      </p>
      <div style="background:#f9f9f7;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0 0 6px;"><strong>Product:</strong> ${data.productName} × ${data.quantity}</p>
        <p style="margin:0 0 6px;"><strong>Price:</strong> ${priceInfo}</p>
        <p style="margin:0;"><strong>Reference:</strong> <span style="font-family:monospace;">${data.orderReference}</span></p>
      </div>
      <p style="margin:0 0 8px;font-weight:600;color:#1a3a2a;">Next steps</p>
      <p style="margin:0 0 20px;color:#4a5568;">
        We will contact you shortly to confirm availability, the final amount,
        and delivery arrangements.
      </p>
      <p style="margin:0;color:#4a5568;font-size:14px;">
        Any questions? Reply to this email or contact us via WhatsApp.
      </p>
      ${waSection}
    </div>
    <div style="padding:16px 32px;background:#f9f9f7;border-top:1px solid #e8e4dc;">
      <p style="margin:0;font-size:12px;color:#888;">
        Pureva — natural hair care<br>
        This message was sent in response to your order request.
      </p>
    </div>
  </div>
</body>
</html>`
}

export async function sendOrderNotification(
  data: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const businessEmail = process.env.BUSINESS_EMAIL
  const fromEmail = process.env.FROM_EMAIL

  if (!apiKey || !businessEmail || !fromEmail) {
    console.error('[resend] Missing required email configuration (RESEND_API_KEY, BUSINESS_EMAIL, or FROM_EMAIL)')
    return { success: false, error: 'Email service not configured' }
  }

  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from: `Pureva Orders <${fromEmail}>`,
      to: [businessEmail],
      replyTo: data.customerEmail,
      subject: `Nouvelle commande Pureva — ${data.orderReference}`,
      html: buildBusinessEmail(data),
    })

    if (error) {
      console.error('[resend] Failed to send business notification:', error.message)
      return { success: false, error: 'Failed to send notification' }
    }

    return { success: true }
  } catch {
    console.error('[resend] Unexpected error sending business notification')
    return { success: false, error: 'Failed to send notification' }
  }
}

export async function sendOrderConfirmation(
  data: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL

  if (!apiKey || !fromEmail) {
    console.error('[resend] Missing required email configuration (RESEND_API_KEY or FROM_EMAIL)')
    return { success: false, error: 'Email service not configured' }
  }

  const resend = new Resend(apiKey)

  const subject =
    data.locale === 'fr'
      ? `Demande de commande reçue — ${data.orderReference}`
      : `Order request received — ${data.orderReference}`

  const html = data.locale === 'fr'
    ? buildCustomerEmailFr(data)
    : buildCustomerEmailEn(data)

  try {
    const { error } = await resend.emails.send({
      from: `Pureva <${fromEmail}>`,
      to: [data.customerEmail],
      subject,
      html,
    })

    if (error) {
      console.error('[resend] Failed to send customer confirmation:', error.message)
      return { success: false, error: 'Failed to send confirmation' }
    }

    return { success: true }
  } catch {
    console.error('[resend] Unexpected error sending customer confirmation')
    return { success: false, error: 'Failed to send confirmation' }
  }
}
