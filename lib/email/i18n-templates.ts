/**
 * UFO LABZ Localized Email System
 * Supports 4 locales (fr [default], en, de, it) and 2 currencies (CHF, EUR)
 * Preserves canonical product names from lib/products.ts
 */

import { Locale, DEFAULT_LOCALE, getLocalePath } from '@/lib/i18n/config'
import { getProductDisplayName } from '@/lib/products'
import { formatCurrencyPrice, SupportedCurrency } from '@/lib/config/pricing'

export type EmailTemplateKey =
  | 'order_confirmation'
  | 'preorder_confirmation'
  | 'payment_receipt'
  | 'order_shipped'
  | 'order_cancelled'
  | 'order_delayed'
  | 'order_delivered'
  | 'reset_password'
  | 'password_changed'
  | 'confirm_email'
  | 'welcome_google'
  | 'contact_auto_reply'
  | 'affiliate_approved'
  | 'affiliate_application_received'
  | 'commission_earned'
  | 'coupon_approved'
  | 'coupon_rejected'
  // 6 Lifecycle Flows
  | 'abandoned_cart'
  | 'browse_abandonment'
  | 'restock_reminder'
  | 'win_back'
  | 'lead_nurture'
  | 'affiliate_reengagement'
  // Admin alerts
  | 'admin_new_order'
  | 'affiliate_application_admin_alert'
  | 'coupon_submitted_admin_alert'

export const ALL_EMAIL_TEMPLATE_KEYS: EmailTemplateKey[] = [
  'order_confirmation',
  'preorder_confirmation',
  'payment_receipt',
  'order_shipped',
  'order_cancelled',
  'order_delayed',
  'order_delivered',
  'reset_password',
  'password_changed',
  'confirm_email',
  'welcome_google',
  'contact_auto_reply',
  'affiliate_approved',
  'affiliate_application_received',
  'commission_earned',
  'coupon_approved',
  'coupon_rejected',
  'abandoned_cart',
  'browse_abandonment',
  'restock_reminder',
  'win_back',
  'lead_nurture',
  'affiliate_reengagement',
  'admin_new_order',
  'affiliate_application_admin_alert',
  'coupon_submitted_admin_alert',
]

interface TemplateCopy {
  subject: (vars: Record<string, any>) => string
  preheader: (vars: Record<string, any>) => string
  headline: (vars: Record<string, any>) => string
  body: (vars: Record<string, any>) => string
  ctaText?: (vars: Record<string, any>) => string
  ctaUrlKey?: string
}

export const EMAIL_DICTIONARY: Record<Locale, Record<EmailTemplateKey, TemplateCopy>> = {
  fr: {
    order_confirmation: {
      subject: (v) => `Confirmation de commande #${v.order_number || ''} · UFO LABZ`,
      preheader: () => `Merci pour votre commande. Votre lot est sécurisé et en cours de préparation en Suisse.`,
      headline: (v) => `Commande confirmée, ${v.first_name || 'Athlète'}`,
      body: () => `Nous avons bien reçu votre commande. Votre réservation du Lot 01 est enregistrée et sera expédiée avec soin depuis notre laboratoire en Suisse.`,
      ctaText: () => `Voir ma commande`,
      ctaUrlKey: 'order_url',
    },
    preorder_confirmation: {
      subject: (v) => `Réservation Lot 01 confirmée #${v.order_number || ''} · UFO LABZ`,
      preheader: () => `Votre allocation prioritaire Lot 01 est verrouillée. Expédition 2e semaine de décembre 2026.`,
      headline: (v) => `Allocation Lot 01 Sécurisée, ${v.first_name || 'Athlète'}`,
      body: (v) => `Félicitations. Vous faites partie des premiers à sécuriser le Lot 01 avec 25% de remise de lancement. Vos formules entreront en conditionnement final pour une expédition prioritaire dès la 2e semaine de décembre 2026.`,
      ctaText: () => `Suivre mon statut de précommande`,
      ctaUrlKey: 'order_url',
    },
    payment_receipt: {
      subject: (v) => `Reçu de paiement pour la commande #${v.order_number || ''}`,
      preheader: () => `Votre paiement a été traité avec succès.`,
      headline: () => `Paiement Confirmé`,
      body: (v) => `Nous confirmons la réception de votre paiement de ${v.total || ''} par ${v.payment_method || 'Carte'}. Votre reçu officiel est disponible ci-dessous.`,
      ctaText: () => `Télécharger la facture`,
      ctaUrlKey: 'order_url',
    },
    order_shipped: {
      subject: (v) => `Votre colis #${v.order_number || ''} est en route 🛸`,
      preheader: () => `Votre commande a été remise à La Poste Suisse avec suivi prioritaire.`,
      headline: (v) => `Expédition en cours, ${v.first_name || 'Athlète'}`,
      body: (v) => `Bonne nouvelle ! Votre colis a été pris en charge par notre transporteur. Numéro de suivi : ${v.tracking_number || ''}.`,
      ctaText: () => `Suivre mon colis`,
      ctaUrlKey: 'tracking_url',
    },
    order_cancelled: {
      subject: (v) => `Annulation de votre commande #${v.order_number || ''}`,
      preheader: () => `Votre commande a été annulée et remboursée.`,
      headline: () => `Commande annulée`,
      body: (v) => `Votre commande #${v.order_number || ''} a été annulée. Un remboursement intégral de ${v.refund_amount || v.total || ''} a été émis sur votre moyen de paiement d'origine.`,
      ctaText: () => `Retourner sur la boutique`,
      ctaUrlKey: 'shop_url',
    },
    order_delayed: {
      subject: (v) => `Mise à jour concernant votre commande #${v.order_number || ''}`,
      preheader: () => `Une légère mise à jour sur le calendrier d'expédition de votre lot.`,
      headline: () => `Mise à jour du calendrier`,
      body: (v) => `Nos normes suisses exigent un contrôle qualité sans compromis. L'expédition de votre commande est prévue pour le ${v.new_eta || 'prochainement'}. Merci pour votre confiance.`,
      ctaText: () => `Consulter le statut`,
      ctaUrlKey: 'order_url',
    },
    order_delivered: {
      subject: (v) => `Votre colis UFO LABZ a été livré 🛸`,
      preheader: () => `Votre commande a été remise à votre adresse. Il est temps de débloquer votre potentiel.`,
      headline: (v) => `Colis livré, ${v.first_name || 'Athlète'}`,
      body: () => `La Poste confirme la livraison de vos formules. Intégrez-les dès aujourd'hui dans votre protocole d'entraînement pour des résultats maximaux.`,
      ctaText: () => `Partager mon avis`,
      ctaUrlKey: 'review_url',
    },
    reset_password: {
      subject: () => `Réinitialisation de votre mot de passe UFO LABZ`,
      preheader: () => `Cliquez sur le lien pour définir un nouveau mot de passe sécurisé.`,
      headline: () => `Réinitialisez votre mot de passe`,
      body: () => `Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien expire dans 60 minutes.`,
      ctaText: () => `Changer mon mot de passe`,
      ctaUrlKey: 'reset_url',
    },
    password_changed: {
      subject: () => `Votre mot de passe UFO LABZ a été modifié`,
      preheader: () => `Votre mot de passe a été mis à jour avec succès.`,
      headline: () => `Mot de passe mis à jour`,
      body: () => `Le mot de passe de votre compte UFO LABZ vient d'être mis à jour. Si vous n'êtes pas à l'origine de cette action, veuillez contacter immédiatement notre support.`,
      ctaText: () => `Sécuriser mon compte`,
      ctaUrlKey: 'account_url',
    },
    confirm_email: {
      subject: () => `Activez votre compte UFO LABZ`,
      preheader: () => `Confirmez votre adresse email pour débloquer votre espace athlète.`,
      headline: (v) => `Bienvenue chez UFO LABZ, ${v.first_name || 'Athlète'}`,
      body: () => `Merci de confirmer votre adresse email en cliquant sur le bouton ci-dessous pour finaliser l'activation de votre compte.`,
      ctaText: () => `Confirmer mon email`,
      ctaUrlKey: 'confirm_url',
    },
    welcome_google: {
      subject: () => `Bienvenue dans l'univers UFO LABZ 🛸`,
      preheader: () => `Votre compte athlète est prêt. Aucun mot de passe requis.`,
      headline: (v) => `Bienvenue à bord, ${v.first_name || 'Athlète'}`,
      body: () => `Votre compte a été créé avec Google. Vous pouvez dès à présent composer votre Custom Stack et accéder à vos récompenses fidélité.`,
      ctaText: () => `Explorer la boutique`,
      ctaUrlKey: 'shop_url',
    },
    contact_auto_reply: {
      subject: () => `Nous avons bien reçu votre message · UFO LABZ`,
      preheader: () => `Notre équipe scientifique suisse vous répond en moins de 24h.`,
      headline: () => `Message bien reçu`,
      body: () => `Merci de nous avoir contactés. Notre équipe à Zurich traite votre demande avec attention et vous apportera une réponse personnalisée dans les 24 heures.`,
      ctaText: () => `Consulter la FAQ`,
      ctaUrlKey: 'faq_url',
    },
    affiliate_approved: {
      subject: () => `Félicitations ! Vous êtes ambassadeur officiel UFO LABZ 🛸`,
      preheader: () => `Votre candidature est validée. Vos liens et codes promo sont actifs.`,
      headline: (v) => `Bienvenue dans l'équipe, ${v.first_name || 'Ambassadeur'}`,
      body: (v) => `Votre profil d'ambassadeur a été approuvé. Votre code promo personnel ${v.coupon_code || ''} vous permet dès aujourd'hui de toucher jusqu'à 20% de commission sur chaque vente.`,
      ctaText: () => `Accéder à mon portail ambassadeur`,
      ctaUrlKey: 'dashboard_url',
    },
    affiliate_application_received: {
      subject: () => `Candidature Ambassadeur reçue · UFO LABZ`,
      preheader: () => `Nous étudions votre profil. Retour sous 48h.`,
      headline: (v) => `Candidature en cours d'examen`,
      body: () => `Merci pour votre intérêt pour le programme officiel UFO LABZ. Notre équipe étudie vos réseaux sociaux et vos canaux d'audience et reviendra vers vous sous 48h.`,
      ctaText: () => `En savoir plus sur la marque`,
      ctaUrlKey: 'about_url',
    },
    commission_earned: {
      subject: (v) => `Nouvelle commission de ${v.commission_amount || ''} gagnée ! 💰`,
      preheader: () => `Une nouvelle commande a été passée avec votre code ambassadeur.`,
      headline: () => `Commission débloquée`,
      body: (v) => `Excellente nouvelle ! Une commande de ${v.order_subtotal || ''} vient d'être effectuée avec votre code. Vous avez gagné ${v.commission_amount || ''} (${v.commission_rate || '15'}%).`,
      ctaText: () => `Voir mes gains`,
      ctaUrlKey: 'dashboard_url',
    },
    coupon_approved: {
      subject: (v) => `Votre code promo ${v.coupon_code || ''} est validé !`,
      preheader: () => `Votre code de réduction personnalisé est maintenant opérationnel.`,
      headline: () => `Code promo actif`,
      body: (v) => `Votre code ${v.coupon_code || ''} offrant ${v.discount_value || '10%'} de réduction est désormais actif et prêt à être partagé avec votre communauté.`,
      ctaText: () => `Voir mes codes`,
      ctaUrlKey: 'dashboard_url',
    },
    coupon_rejected: {
      subject: (v) => `Mise à jour concernant votre demande de code promo`,
      preheader: () => `Votre demande nécessite un ajustement avant validation.`,
      headline: () => `Code non validé`,
      body: (v) => `Le code demandé ${v.coupon_code || ''} n'a pas pu être validé en raison de : ${v.reject_reason || 'nom déjà réservé'}. Vous pouvez soumettre une nouvelle proposition depuis votre espace.`,
      ctaText: () => `Proposer un autre code`,
      ctaUrlKey: 'dashboard_url',
    },
    // Lifecycle Flows
    abandoned_cart: {
      subject: () => `Votre stack vous attend toujours chez UFO LABZ`,
      preheader: () => `Les allocations du Lot 01 sont limitées. Finalisez votre commande.`,
      headline: (v) => `Votre sélection est réservée, ${v.first_name || 'Athlète'}`,
      body: () => `Vous avez laissé des formules dans votre panier de précommande. Nous vous rappelons que la remise de lancement de 25% et les réductions de volume de stack sont appliquées.`,
      ctaText: () => `Finaliser ma précommande`,
      ctaUrlKey: 'cart_url',
    },
    browse_abandonment: {
      subject: () => `Vous avez repéré une formule d'élite ?`,
      preheader: () => `Découvrez pourquoi les athlètes suisses choisissent nos formules sans compromis.`,
      headline: () => `Passez au niveau supérieur`,
      body: (v) => `Vous avez récemment consulté ${v.product_name || 'nos formules d’élite'}. Chaque produit est certifié sans charges inutiles et dosé cliniquement.`,
      ctaText: () => `Voir la formule`,
      ctaUrlKey: 'product_url',
    },
    restock_reminder: {
      subject: (v) => `Il est temps de renouveler votre stock, ${v.first_name || 'Athlète'} ?`,
      preheader: () => `Ne brisez pas votre protocole. Réapprovisionnez vos suppléments.`,
      headline: () => `Maintenez votre dynamique`,
      body: (v) => `Cela fait environ 45 jours depuis votre dernière commande de ${v.product_name || 'vos suppléments'}. Commandez dès maintenant pour garantir la continuité de votre supplémentation.`,
      ctaText: () => `Renouveler mon stock (-15%)`,
      ctaUrlKey: 'reorder_url',
    },
    win_back: {
      subject: () => `Vous nous manquez · Voici 15% pour votre retour`,
      preheader: () => `Découvrez nos dernières formules suisses avec un avantage exclusif.`,
      headline: (v) => `Revenez plus fort, ${v.first_name || 'Athlète'}`,
      body: () => `Prêt à reprendre l'entraînement au plus haut niveau ? Utilisez le code WELCOMEBACK pour débloquer 15% de remise supplémentaire sur votre prochain panier.`,
      ctaText: () => `Débloquer mes 15%`,
      ctaUrlKey: 'shop_url',
    },
    lead_nurture: {
      subject: () => `Votre protocole nutritionnel personnalisé · UFO LABZ`,
      preheader: () => `Découvrez les données scientifiques derrière nos 10 calculateurs gratuits.`,
      headline: () => `Optimisez vos performances`,
      body: () => `Vous avez récemment utilisé nos calculateurs scientifiques. Maximisez vos résultats dès maintenant en associant la bonne alimentation aux suppléments suisses de haute pureté.`,
      ctaText: () => `Découvrir les calculateurs & formules`,
      ctaUrlKey: 'tools_url',
    },
    affiliate_reengagement: {
      subject: () => `Boostez vos gains ce mois-ci · Programme Ambassadeur UFO LABZ`,
      preheader: () => `Découvrez les nouvelles créations et astuces pour doubler vos commissions.`,
      headline: () => `De nouvelles opportunités vous attendent`,
      body: () => `Votre audience recherche la pureté suisse. Téléchargez nos nouveaux visuels de marque et partagez votre code pour atteindre le palier Amiral Alien à 20% de commission.`,
      ctaText: () => `Ouvrir le portail ambassadeur`,
      ctaUrlKey: 'dashboard_url',
    },
    admin_new_order: {
      subject: (v) => `[ADMIN] Nouvelle commande #${v.order_number || ''} (${v.total || ''})`,
      preheader: () => `Une nouvelle commande a été enregistrée.`,
      headline: () => `Nouvelle commande client`,
      body: (v) => `Une nouvelle commande vient d'être passée par ${v.full_name || ''} (${v.email || ''}). Montant : ${v.total || ''}. Devise : ${v.currency || ''}. Langue client : ${v.locale || 'fr'}.`,
      ctaText: () => `Voir la commande dans l'Admin`,
      ctaUrlKey: 'admin_order_url',
    },
    affiliate_application_admin_alert: {
      subject: (v) => `[ADMIN] Nouvelle candidature ambassadeur : ${v.full_name || ''}`,
      preheader: () => `Un athlète a postulé au programme ambassadeur.`,
      headline: () => `Nouvelle candidature ambassadeur`,
      body: (v) => `${v.full_name || ''} (${v.email || ''}) a soumis sa candidature. Réseaux : ${v.social_links || 'Non renseigné'}.`,
      ctaText: () => `Examiner dans l'Admin`,
      ctaUrlKey: 'admin_affiliate_url',
    },
    coupon_submitted_admin_alert: {
      subject: (v) => `[ADMIN] Demande de code promo : ${v.coupon_code || ''}`,
      preheader: () => `Un ambassadeur a proposé un nouveau code de réduction.`,
      headline: () => `Proposition de code promo`,
      body: (v) => `L'ambassadeur ${v.affiliate_name || ''} souhaite créer le code promo : ${v.coupon_code || ''}.`,
      ctaText: () => `Modérer dans l'Admin`,
      ctaUrlKey: 'admin_coupon_url',
    },
  },
  en: {
    order_confirmation: {
      subject: (v) => `Order Confirmation #${v.order_number || ''} · UFO LABZ`,
      preheader: () => `Thank you. Your order is confirmed and being prepared in Switzerland.`,
      headline: (v) => `Order confirmed, ${v.first_name || 'Athlete'}`,
      body: () => `Thank you for your order. We have received your payment and our Swiss laboratory team is preparing your parcel.`,
      ctaText: () => `View your order`,
      ctaUrlKey: 'order_url',
    },
    preorder_confirmation: {
      subject: (v) => `Batch 01 Pre-Order Confirmed #${v.order_number || ''} · UFO LABZ`,
      preheader: () => `Your Batch 01 allocation is locked. Shipping 2nd week of December 2026.`,
      headline: (v) => `Batch 01 Allocation Secured, ${v.first_name || 'Athlete'}`,
      body: () => `Congratulations. You are among the first athletes to secure Batch 01 with 25% launch pricing. Your formulas are queued for final Swiss packaging and priority dispatch starting the 2nd week of December 2026.`,
      ctaText: () => `Track pre-order status`,
      ctaUrlKey: 'order_url',
    },
    payment_receipt: {
      subject: (v) => `Payment receipt for order #${v.order_number || ''}`,
      preheader: () => `Your payment has been successfully processed.`,
      headline: () => `Payment Successful`,
      body: (v) => `We confirm receipt of your payment of ${v.total || ''} via ${v.payment_method || 'Card'}. Your official receipt details are below.`,
      ctaText: () => `Download invoice`,
      ctaUrlKey: 'order_url',
    },
    order_shipped: {
      subject: (v) => `Your order #${v.order_number || ''} is on its way 🛸`,
      preheader: () => `Your parcel has shipped with Swiss Post priority tracking.`,
      headline: (v) => `Order shipped, ${v.first_name || 'Athlete'}`,
      body: (v) => `Great news! Your parcel has been handed over to the courier. Tracking number: ${v.tracking_number || ''}.`,
      ctaText: () => `Track your parcel`,
      ctaUrlKey: 'tracking_url',
    },
    order_cancelled: {
      subject: (v) => `Order #${v.order_number || ''} cancelled`,
      preheader: () => `Your order was cancelled and a full refund has been issued.`,
      headline: () => `Order cancelled`,
      body: (v) => `Your order #${v.order_number || ''} has been cancelled. A refund of ${v.refund_amount || v.total || ''} has been credited back to your original payment method.`,
      ctaText: () => `Return to shop`,
      ctaUrlKey: 'shop_url',
    },
    order_delayed: {
      subject: (v) => `Update on your order #${v.order_number || ''}`,
      preheader: () => `A short update regarding your batch dispatch timeline.`,
      headline: () => `Schedule update`,
      body: (v) => `Our Swiss standards require uncompromising quality control. Expected dispatch is now ${v.new_eta || 'shortly'}. Thank you for your patience.`,
      ctaText: () => `View order status`,
      ctaUrlKey: 'order_url',
    },
    order_delivered: {
      subject: (v) => `Your UFO LABZ order has been delivered 🛸`,
      preheader: () => `Your parcel has arrived. Time to fuel your performance.`,
      headline: (v) => `Order delivered, ${v.first_name || 'Athlete'}`,
      body: () => `Swiss Post confirms your package has arrived. Incorporate your formulas into your training protocol today.`,
      ctaText: () => `Leave a review`,
      ctaUrlKey: 'review_url',
    },
    reset_password: {
      subject: () => `Reset your UFO LABZ password`,
      preheader: () => `Click the link to choose a new password.`,
      headline: () => `Reset your password`,
      body: () => `We received a request to reset your password. Click the button below to set a new one. This link expires in 60 minutes.`,
      ctaText: () => `Reset password`,
      ctaUrlKey: 'reset_url',
    },
    password_changed: {
      subject: () => `Your UFO LABZ password was changed`,
      preheader: () => `Your password has been successfully updated.`,
      headline: () => `Password updated`,
      body: () => `The password for your UFO LABZ account was changed. If you did not make this change, please contact support immediately.`,
      ctaText: () => `Secure my account`,
      ctaUrlKey: 'account_url',
    },
    confirm_email: {
      subject: () => `Confirm your email · UFO LABZ`,
      preheader: () => `Confirm your email address to activate your athlete account.`,
      headline: (v) => `Welcome to UFO LABZ, ${v.first_name || 'Athlete'}`,
      body: () => `Please confirm your email address by clicking the button below to complete account activation.`,
      ctaText: () => `Confirm email`,
      ctaUrlKey: 'confirm_url',
    },
    welcome_google: {
      subject: () => `Welcome to UFO LABZ 🛸`,
      preheader: () => `Your athlete account is ready. No password needed.`,
      headline: (v) => `Welcome aboard, ${v.first_name || 'Athlete'}`,
      body: () => `You signed in with Google and your account is active. Build your custom stack and start earning loyalty points today.`,
      ctaText: () => `Explore shop`,
      ctaUrlKey: 'shop_url',
    },
    contact_auto_reply: {
      subject: () => `We received your message · UFO LABZ`,
      preheader: () => `Our Swiss team responds within 24 hours.`,
      headline: () => `Message received`,
      body: () => `Thank you for contacting us. Our Zurich team will review your inquiry and get back to you within 24 hours.`,
      ctaText: () => `Browse FAQ`,
      ctaUrlKey: 'faq_url',
    },
    affiliate_approved: {
      subject: () => `Congratulations! You are an official UFO LABZ Ambassador 🛸`,
      preheader: () => `Your application has been approved. Your affiliate links are live.`,
      headline: (v) => `Welcome to the team, ${v.first_name || 'Ambassador'}`,
      body: (v) => `Your ambassador profile has been approved. Use your personal coupon code ${v.coupon_code || ''} to start earning up to 20% commission on every sale.`,
      ctaText: () => `Access ambassador portal`,
      ctaUrlKey: 'dashboard_url',
    },
    affiliate_application_received: {
      subject: () => `Ambassador application received · UFO LABZ`,
      preheader: () => `We are reviewing your application. Response within 48h.`,
      headline: () => `Application under review`,
      body: () => `Thank you for applying to the UFO LABZ Ambassador program. Our team will review your application and reach out within 48 hours.`,
      ctaText: () => `Learn more about UFO LABZ`,
      ctaUrlKey: 'about_url',
    },
    commission_earned: {
      subject: (v) => `New commission earned: ${v.commission_amount || ''}! 💰`,
      preheader: () => `A new order has been placed using your ambassador code.`,
      headline: () => `Commission unlocked`,
      body: (v) => `Great news! An order of ${v.order_subtotal || ''} was just placed using your code. You earned ${v.commission_amount || ''} (${v.commission_rate || '15'}%).`,
      ctaText: () => `View my earnings`,
      ctaUrlKey: 'dashboard_url',
    },
    coupon_approved: {
      subject: (v) => `Your promo code ${v.coupon_code || ''} is approved!`,
      preheader: () => `Your custom discount code is now active and ready to share.`,
      headline: () => `Promo code active`,
      body: (v) => `Your code ${v.coupon_code || ''} offering ${v.discount_value || '10%'} discount is now live and ready to share with your audience.`,
      ctaText: () => `View my codes`,
      ctaUrlKey: 'dashboard_url',
    },
    coupon_rejected: {
      subject: (v) => `Update on your promo code request`,
      preheader: () => `Your promo code request needs an adjustment.`,
      headline: () => `Code not approved`,
      body: (v) => `Your proposed code ${v.coupon_code || ''} could not be approved due to: ${v.reject_reason || 'name already reserved'}. Please submit a new code from your portal.`,
      ctaText: () => `Submit new code`,
      ctaUrlKey: 'dashboard_url',
    },
    abandoned_cart: {
      subject: () => `Your stack is still waiting at UFO LABZ`,
      preheader: () => `Batch 01 allocations are limited. Complete your order.`,
      headline: (v) => `Your stack is waiting, ${v.first_name || 'Athlete'}`,
      body: () => `You left formulas in your pre-order cart. Your 25% launch discount and custom stack savings are preserved for a limited time.`,
      ctaText: () => `Complete my pre-order`,
      ctaUrlKey: 'cart_url',
    },
    browse_abandonment: {
      subject: () => `Spotted an elite formula?`,
      preheader: () => `Discover why athletes choose Swiss precision nutrition.`,
      headline: () => `Upgrade your athletic baseline`,
      body: (v) => `You recently browsed ${v.product_name || 'our elite formulas'}. Engineered with pure clinical dosages and zero unnecessary fillers.`,
      ctaText: () => `View formula`,
      ctaUrlKey: 'product_url',
    },
    restock_reminder: {
      subject: (v) => `Time to restock your supply, ${v.first_name || 'Athlete'}?`,
      preheader: () => `Don't break your protocol. Restock your formulas.`,
      headline: () => `Keep your momentum`,
      body: (v) => `It has been about 45 days since your last order of ${v.product_name || 'your supplements'}. Reorder now to keep your routine uninterrupted.`,
      ctaText: () => `Restock now (-15%)`,
      ctaUrlKey: 'reorder_url',
    },
    win_back: {
      subject: () => `We miss you · Take 15% off your next stack`,
      preheader: () => `Discover our latest Swiss formulations with an exclusive reward.`,
      headline: (v) => `Come back stronger, ${v.first_name || 'Athlete'}`,
      body: () => `Ready to return to peak performance? Use code WELCOMEBACK for an extra 15% off your entire next order.`,
      ctaText: () => `Claim my 15% discount`,
      ctaUrlKey: 'shop_url',
    },
    lead_nurture: {
      subject: () => `Your custom athletic protocol · UFO LABZ`,
      preheader: () => `Explore the science behind our 10 free calculators.`,
      headline: () => `Optimize your parameters`,
      body: () => `You recently used our science-backed fitness calculators. Pair your calculated targets with pure Swiss supplements for maximum results.`,
      ctaText: () => `Explore calculators & formulas`,
      ctaUrlKey: 'tools_url',
    },
    affiliate_reengagement: {
      subject: () => `Boost your earnings this month · UFO LABZ Ambassador Program`,
      preheader: () => `New creative assets to double your referral commissions.`,
      headline: () => `New opportunities await`,
      body: () => `Your audience values Swiss purity. Download our fresh marketing assets and share your code to reach the Alien Admiral tier at 20% commission.`,
      ctaText: () => `Open ambassador portal`,
      ctaUrlKey: 'dashboard_url',
    },
    admin_new_order: {
      subject: (v) => `[ADMIN] New Order #${v.order_number || ''} (${v.total || ''})`,
      preheader: () => `A new order has been placed.`,
      headline: () => `New Customer Order`,
      body: (v) => `New order placed by ${v.full_name || ''} (${v.email || ''}). Amount: ${v.total || ''}. Currency: ${v.currency || ''}. Customer locale: ${v.locale || 'en'}.`,
      ctaText: () => `View in Admin Dashboard`,
      ctaUrlKey: 'admin_order_url',
    },
    affiliate_application_admin_alert: {
      subject: (v) => `[ADMIN] New Ambassador Application: ${v.full_name || ''}`,
      preheader: () => `An athlete applied for the ambassador program.`,
      headline: () => `New Ambassador Application`,
      body: (v) => `${v.full_name || ''} (${v.email || ''}) applied. Social links: ${v.social_links || 'None'}.`,
      ctaText: () => `Review in Admin`,
      ctaUrlKey: 'admin_affiliate_url',
    },
    coupon_submitted_admin_alert: {
      subject: (v) => `[ADMIN] Promo Code Request: ${v.coupon_code || ''}`,
      preheader: () => `An ambassador requested a new coupon code.`,
      headline: () => `Coupon Code Proposal`,
      body: (v) => `Ambassador ${v.affiliate_name || ''} requested coupon code: ${v.coupon_code || ''}.`,
      ctaText: () => `Moderate in Admin`,
      ctaUrlKey: 'admin_coupon_url',
    },
  },
  de: {
    order_confirmation: {
      subject: (v) => `Bestellbestätigung #${v.order_number || ''} · UFO LABZ`,
      preheader: () => `Vielen Dank. Ihre Bestellung ist bestätigt und wird in der Schweiz vorbereitet.`,
      headline: (v) => `Bestellung bestätigt, ${v.first_name || 'Athlet'}`,
      body: () => `Vielen Dank für Ihre Bestellung. Wir haben Ihre Zahlung erhalten und unser Team in der Schweiz bereitet Ihr Paket vor.`,
      ctaText: () => `Bestellung ansehen`,
      ctaUrlKey: 'order_url',
    },
    preorder_confirmation: {
      subject: (v) => `Vorbestellung Charge 01 bestätigt #${v.order_number || ''} · UFO LABZ`,
      preheader: () => `Ihr Kontingent für Charge 01 ist gesichert. Versand ab 2. Dezemberwoche 2026.`,
      headline: (v) => `Kontingent Charge 01 gesichert, ${v.first_name || 'Athlet'}`,
      body: () => `Glückwunsch. Sie gehören zu den ersten Athleten, die sich Charge 01 mit 25% Einführungspreis gesichert haben. Auslieferung ab der 2. Dezemberwoche 2026.`,
      ctaText: () => `Vorbestellstatus prüfen`,
      ctaUrlKey: 'order_url',
    },
    payment_receipt: {
      subject: (v) => `Zahlungsbeleg für Bestellung #${v.order_number || ''}`,
      preheader: () => `Ihre Zahlung wurde erfolgreich verbucht.`,
      headline: () => `Zahlung bestätigt`,
      body: (v) => `Wir bestätigen den Eingang Ihrer Zahlung von ${v.total || ''} via ${v.payment_method || 'Karte'}.`,
      ctaText: () => `Rechnung herunterladen`,
      ctaUrlKey: 'order_url',
    },
    order_shipped: {
      subject: (v) => `Ihr Paket #${v.order_number || ''} ist unterwegs 🛸`,
      preheader: () => `Ihr Paket wurde an die Schweizerische Post übergeben.`,
      headline: (v) => `Paket versandt, ${v.first_name || 'Athlet'}`,
      body: (v) => `Gute Neuigkeiten! Ihr Paket wurde versendet. Sendungsverfolgungsnummer: ${v.tracking_number || ''}.`,
      ctaText: () => `Sendung verfolgen`,
      ctaUrlKey: 'tracking_url',
    },
    order_cancelled: {
      subject: (v) => `Bestellung #${v.order_number || ''} storniert`,
      preheader: () => `Ihre Bestellung wurde storniert und erstattet.`,
      headline: () => `Bestellung storniert`,
      body: (v) => `Ihre Bestellung #${v.order_number || ''} wurde storniert. Der Betrag von ${v.refund_amount || v.total || ''} wurde erstattet.`,
      ctaText: () => `Zurück zum Shop`,
      ctaUrlKey: 'shop_url',
    },
    order_delayed: {
      subject: (v) => `Update zu Ihrer Bestellung #${v.order_number || ''}`,
      preheader: () => `Eine kurze Aktualisierung zu Ihrem Lieferzeitplan.`,
      headline: () => `Zeitplan-Aktualisierung`,
      body: (v) => `Unsere Schweizer Qualitätsstandards erfordern kompromisslose Prüfungen. Der neue voraussichtliche Versandtermin ist: ${v.new_eta || 'in Kürze'}.`,
      ctaText: () => `Status ansehen`,
      ctaUrlKey: 'order_url',
    },
    order_delivered: {
      subject: (v) => `Ihr UFO LABZ Paket wurde zugestellt 🛸`,
      preheader: () => `Ihr Paket ist angekommen. Zeit für Spitzenleistung.`,
      headline: (v) => `Paket zugestellt, ${v.first_name || 'Athlet'}`,
      body: () => `Die Schweizerische Post bestätigt die Zustellung Ihrer Rezepturen. Starten Sie noch heute Ihr neues Protokoll.`,
      ctaText: () => `Bewertung abgeben`,
      ctaUrlKey: 'review_url',
    },
    reset_password: {
      subject: () => `UFO LABZ Passwort zurücksetzen`,
      preheader: () => `Klicken Sie auf den Link, um ein neues Passwort festzulegen.`,
      headline: () => `Passwort zurücksetzen`,
      body: () => `Wir haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten. Dieser Link ist 60 Minuten lang gültig.`,
      ctaText: () => `Neues Passwort wählen`,
      ctaUrlKey: 'reset_url',
    },
    password_changed: {
      subject: () => `Ihr UFO LABZ Passwort wurde geändert`,
      preheader: () => `Ihr Passwort wurde erfolgreich aktualisiert.`,
      headline: () => `Passwort geändert`,
      body: () => `Das Passwort für Ihr UFO LABZ Konto wurde geändert. Falls Sie dies nicht waren, kontaktieren Sie uns bitte sofort.`,
      ctaText: () => `Konto absichern`,
      ctaUrlKey: 'account_url',
    },
    confirm_email: {
      subject: () => `E-Mail-Adresse bestätigen · UFO LABZ`,
      preheader: () => `Bestätigen Sie Ihre E-Mail-Adresse zur Aktivierung Ihres Kontos.`,
      headline: (v) => `Willkommen bei UFO LABZ, ${v.first_name || 'Athlet'}`,
      body: () => `Bitte bestätigen Sie Ihre E-Mail-Adresse über den untenstehenden Button, um Ihr Konto freizuschalten.`,
      ctaText: () => `E-Mail bestätigen`,
      ctaUrlKey: 'confirm_url',
    },
    welcome_google: {
      subject: () => `Willkommen bei UFO LABZ 🛸`,
      preheader: () => `Ihr Athleten-Konto ist bereit. Kein Passwort erforderlich.`,
      headline: (v) => `Willkommen an Bord, ${v.first_name || 'Athlet'}`,
      body: () => `Ihr Konto wurde via Google eingerichtet. Stellen Sie Ihren Custom Stack zusammen und sammeln Sie Treuepunkte.`,
      ctaText: () => `Shop entdecken`,
      ctaUrlKey: 'shop_url',
    },
    contact_auto_reply: {
      subject: () => `Ihre Nachricht ist eingegangen · UFO LABZ`,
      preheader: () => `Unser Schweizer Team antwortet innerhalb von 24 Stunden.`,
      headline: () => `Nachricht erhalten`,
      body: () => `Vielen Dank für Ihre Nachricht. Unser Team in Zürich bearbeitet Ihr Anliegen und antwortet innerhalb von 24 Stunden.`,
      ctaText: () => `FAQ durchsuchen`,
      ctaUrlKey: 'faq_url',
    },
    affiliate_approved: {
      subject: () => `Glückwunsch! Sie sind offizieller UFO LABZ Markenbotschafter 🛸`,
      preheader: () => `Ihre Bewerbung wurde angenommen. Ihre Links sind aktiv.`,
      headline: (v) => `Willkommen im Team, ${v.first_name || 'Botschafter'}`,
      body: (v) => `Ihr Profil wurde bestätigt. Mit Ihrem persönlichen Code ${v.coupon_code || ''} verdienen Sie bis zu 20% Provision bei jedem Verkauf.`,
      ctaText: () => `Zum Botschafter-Portal`,
      ctaUrlKey: 'dashboard_url',
    },
    affiliate_application_received: {
      subject: () => `Bewerbung als Markenbotschafter eingegangen · UFO LABZ`,
      preheader: () => `Wir prüfen Ihr Profil. Rückmeldung innerhalb von 48 Stunden.`,
      headline: () => `Bewerbung wird geprüft`,
      body: () => `Vielen Dank für Ihr Interesse am UFO LABZ Programm. Unser Team prüft Ihre Angaben und meldet sich innerhalb von 48h.`,
      ctaText: () => `Mehr über UFO LABZ erfahren`,
      ctaUrlKey: 'about_url',
    },
    commission_earned: {
      subject: (v) => `Neue Provision verdient: ${v.commission_amount || ''}! 💰`,
      preheader: () => `Eine neue Bestellung wurde mit Ihrem Code getätigt.`,
      headline: () => `Provision freigeschaltet`,
      body: (v) => `Tolle Neuigkeiten! Eine Bestellung über ${v.order_subtotal || ''} wurde mit Ihrem Code aufgegeben. Sie erhalten ${v.commission_amount || ''} (${v.commission_rate || '15'}%).`,
      ctaText: () => `Verdienst ansehen`,
      ctaUrlKey: 'dashboard_url',
    },
    coupon_approved: {
      subject: (v) => `Ihr Rabattcode ${v.coupon_code || ''} ist aktiv!`,
      preheader: () => `Ihr individueller Gutscheincode ist nun einsatzbereit.`,
      headline: () => `Rabattcode freigeschaltet`,
      body: (v) => `Ihr Code ${v.coupon_code || ''} mit ${v.discount_value || '10%'} Rabatt ist jetzt aktiv und bereit zum Teilen.`,
      ctaText: () => `Codes ansehen`,
      ctaUrlKey: 'dashboard_url',
    },
    coupon_rejected: {
      subject: (v) => `Update zu Ihrer Rabattcode-Anfrage`,
      preheader: () => `Ihre Code-Anfrage erfordert eine Anpassung.`,
      headline: () => `Code nicht freigegeben`,
      body: (v) => `Der gewünschte Code ${v.coupon_code || ''} konnte nicht freigegeben werden: ${v.reject_reason || 'bereits vergeben'}. Bitte schlagen Sie einen neuen vor.`,
      ctaText: () => `Neuen Code vorschlagen`,
      ctaUrlKey: 'dashboard_url',
    },
    abandoned_cart: {
      subject: () => `Ihr Stack wartet noch bei UFO LABZ auf Sie`,
      preheader: () => `Die Kontingente für Charge 01 sind begrenzt. Schließen Sie Ihre Vorbestellung ab.`,
      headline: (v) => `Ihre Auswahl ist reserviert, ${v.first_name || 'Athlet'}`,
      body: () => `Sie haben Rezepturen im Vorbestell-Warenkorb gelassen. Sichern Sie sich 25% Einführungsrabatt und bis zu 15% Stack-Vorteil.`,
      ctaText: () => `Vorbestellung abschließen`,
      ctaUrlKey: 'cart_url',
    },
    browse_abandonment: {
      subject: () => `Elite-Rezeptur entdeckt?`,
      preheader: () => `Schweizer Präzisionsernährung für Höchstleistungen.`,
      headline: () => `Heben Sie Ihr Training auf das nächste Level`,
      body: (v) => `Sie haben sich kürzlich ${v.product_name || 'unsere Elite-Formeln'} angesehen. Vollständig klinisch dosiert, ohne unnötige Füllstoffe.`,
      ctaText: () => `Rezeptur ansehen`,
      ctaUrlKey: 'product_url',
    },
    restock_reminder: {
      subject: (v) => `Zeit für Nachschub, ${v.first_name || 'Athlet'}?`,
      preheader: () => `Unterbrechen Sie Ihr Protokoll nicht. Jetzt Vorrat sichern.`,
      headline: () => `Bleiben Sie am Ball`,
      body: (v) => `Vor rund 45 Tagen haben Sie ${v.product_name || 'Ihre Supplemente'} bestellt. Jetzt rechtzeitig nachbestellen und 15% sparen.`,
      ctaText: () => `Jetzt nachbestellen (-15%)`,
      ctaUrlKey: 'reorder_url',
    },
    win_back: {
      subject: () => `Wir vermissen Sie · 15% Rabatt auf Ihre Rückkehr`,
      preheader: () => `Entdecken Sie unsere neuesten Schweizer Rezepturen mit Extra-Rabatt.`,
      headline: (v) => `Kommen Sie stärker zurück, ${v.first_name || 'Athlet'}`,
      body: () => `Bereit für neue Bestleistungen? Nutzen Sie den Code WELCOMEBACK für 15% Zusatzrabatt auf Ihre nächste Bestellung.`,
      ctaText: () => `15% Rabatt einlösen`,
      ctaUrlKey: 'shop_url',
    },
    lead_nurture: {
      subject: () => `Ihr individuelles Trainings- & Ernährungsprotokoll · UFO LABZ`,
      preheader: () => `Wissenschaftliche Berechnungen und passende Schweizer Formeln.`,
      headline: () => `Optimieren Sie Ihre Parameter`,
      body: () => `Sie haben unsere wissenschaftlichen Rechner genutzt. Kombinieren Sie Ihre errechneten Werte mit reinen Schweizer Formeln für maximale Ergebnisse.`,
      ctaText: () => `Rechner & Rezepturen ansehen`,
      ctaUrlKey: 'tools_url',
    },
    affiliate_reengagement: {
      subject: () => `Steigern Sie Ihre Provisionen diesen Monat · UFO LABZ`,
      preheader: () => `Neue Werbemittel und Tipps für höhere Auszahlungen.`,
      headline: () => `Neue Verdienstmöglichkeiten`,
      body: () => `Ihre Community schätzt Schweizer Reinheit. Nutzen Sie unsere neuen Vorlagen, um die Stufe Alien-Admiral mit 20% Provision zu erreichen.`,
      ctaText: () => `Zum Botschafter-Portal`,
      ctaUrlKey: 'dashboard_url',
    },
    admin_new_order: {
      subject: (v) => `[ADMIN] Neue Bestellung #${v.order_number || ''} (${v.total || ''})`,
      preheader: () => `Eine neue Kundenbestellung ist eingegangen.`,
      headline: () => `Neue Kundenbestellung`,
      body: (v) => `Bestellung von ${v.full_name || ''} (${v.email || ''}). Summe: ${v.total || ''}. Währung: ${v.currency || ''}. Sprache: ${v.locale || 'de'}.`,
      ctaText: () => `Im Admin-Dashboard öffnen`,
      ctaUrlKey: 'admin_order_url',
    },
    affiliate_application_admin_alert: {
      subject: (v) => `[ADMIN] Neue Botschafter-Bewerbung: ${v.full_name || ''}`,
      preheader: () => `Eine neue Bewerbung liegt vor.`,
      headline: () => `Neue Bewerbung`,
      body: (v) => `${v.full_name || ''} (${v.email || ''}) hat sich beworben. Social: ${v.social_links || 'Keine'}.`,
      ctaText: () => `Im Admin prüfen`,
      ctaUrlKey: 'admin_affiliate_url',
    },
    coupon_submitted_admin_alert: {
      subject: (v) => `[ADMIN] Neuer Gutscheincode beantragt: ${v.coupon_code || ''}`,
      preheader: () => `Ein Botschafter hat einen neuen Code vorgeschlagen.`,
      headline: () => `Code-Antrag`,
      body: (v) => `Botschafter ${v.affiliate_name || ''} schlägt folgenden Code vor: ${v.coupon_code || ''}.`,
      ctaText: () => `Im Admin moderieren`,
      ctaUrlKey: 'admin_coupon_url',
    },
  },
  it: {
    order_confirmation: {
      subject: (v) => `Conferma d'ordine #${v.order_number || ''} · UFO LABZ`,
      preheader: () => `Grazie per il tuo ordine. Il tuo lotto è confermato e in preparazione in Svizzera.`,
      headline: (v) => `Ordine confermato, ${v.first_name || 'Atleta'}`,
      body: () => `Grazie per il tuo ordine. Abbiamo ricevuto il pagamento e il nostro team svizzero sta preparando la tua spedizione.`,
      ctaText: () => `Visualizza ordine`,
      ctaUrlKey: 'order_url',
    },
    preorder_confirmation: {
      subject: (v) => `Preordine Lotto 01 Confermato #${v.order_number || ''} · UFO LABZ`,
      preheader: () => `La tua allocazione Lotto 01 è bloccata. Spedizione 2a settimana di dicembre 2026.`,
      headline: (v) => `Allocazione Lotto 01 Garantita, ${v.first_name || 'Atleta'}`,
      body: () => `Congratulazioni. Sei tra i primi a garantirti il Lotto 01 con il 25% di sconto lancio. Le tue formule saranno spedite con priorità a partire dalla 2a settimana di dicembre 2026.`,
      ctaText: () => `Verifica stato preordine`,
      ctaUrlKey: 'order_url',
    },
    payment_receipt: {
      subject: (v) => `Ricevuta di pagamento per l'ordine #${v.order_number || ''}`,
      preheader: () => `Il tuo pagamento è stato elaborato con successo.`,
      headline: () => `Pagamento Confermato`,
      body: (v) => `Confermiamo la ricezione del tuo pagamento di ${v.total || ''} tramite ${v.payment_method || 'Carta'}.`,
      ctaText: () => `Scarica fattura`,
      ctaUrlKey: 'order_url',
    },
    order_shipped: {
      subject: (v) => `Il tuo pacco #${v.order_number || ''} è in viaggio 🛸`,
      preheader: () => `Il tuo ordine è stato affidato alla Posta Svizzera con tracciamento prioritario.`,
      headline: (v) => `Spedizione in corso, ${v.first_name || 'Atleta'}`,
      body: (v) => `Ottime notizie! Il tuo pacco è partito. Numero di tracciamento: ${v.tracking_number || ''}.`,
      ctaText: () => `Traccia la spedizione`,
      ctaUrlKey: 'tracking_url',
    },
    order_cancelled: {
      subject: (v) => `Ordine #${v.order_number || ''} annullato`,
      preheader: () => `Il tuo ordine è stato annullato ed è stato emesso il rimborso completo.`,
      headline: () => `Ordine annullato`,
      body: (v) => `Il tuo ordine #${v.order_number || ''} è stato annullato. Un rimborso di ${v.refund_amount || v.total || ''} è stato accreditato sul metodo di pagamento originale.`,
      ctaText: () => `Torna al negozio`,
      ctaUrlKey: 'shop_url',
    },
    order_delayed: {
      subject: (v) => `Aggiornamento sul tuo ordine #${v.order_number || ''}`,
      preheader: () => `Un breve aggiornamento sulle tempistiche di spedizione.`,
      headline: () => `Aggiornamento calendario`,
      body: (v) => `I nostri standard svizzeri impongono controlli qualità rigorosi. La nuova data stimata di spedizione è: ${v.new_eta || 'a breve'}. Grazie per la pazienza.`,
      ctaText: () => `Controlla stato`,
      ctaUrlKey: 'order_url',
    },
    order_delivered: {
      subject: (v) => `Il tuo ordine UFO LABZ è stato consegnato 🛸`,
      preheader: () => `Il pacco è arrivato. È ora di potenziare le tue prestazioni.`,
      headline: (v) => `Pacco consegnato, ${v.first_name || 'Atleta'}`,
      body: () => `La Posta conferma l'avvenuta consegna. Integra subito le formule nel tuo protocollo quotidiano.`,
      ctaText: () => `Lascia una recensione`,
      ctaUrlKey: 'review_url',
    },
    reset_password: {
      subject: () => `Reimposta la tua password UFO LABZ`,
      preheader: () => `Clicca sul link per scegliere una nuova password.`,
      headline: () => `Reimposta password`,
      body: () => `Abbiamo ricevuto una richiesta di reimpostazione password. Clicca sul pulsante sottostante. Il link scade tra 60 minuti.`,
      ctaText: () => `Reimposta password`,
      ctaUrlKey: 'reset_url',
    },
    password_changed: {
      subject: () => `La tua password UFO LABZ è stata modificata`,
      preheader: () => `La tua password è stata aggiornata con successo.`,
      headline: () => `Password aggiornata`,
      body: () => `La password del tuo account UFO LABZ è stata cambiata. Se non sei stato tu, contatta immediatamente il supporto.`,
      ctaText: () => `Proteggi il mio account`,
      ctaUrlKey: 'account_url',
    },
    confirm_email: {
      subject: () => `Conferma la tua email · UFO LABZ`,
      preheader: () => `Conferma l'indirizzo email per attivare il tuo profilo atleta.`,
      headline: (v) => `Benvenuto in UFO LABZ, ${v.first_name || 'Atleta'}`,
      body: () => `Conferma il tuo indirizzo email cliccando sul pulsante in basso per completare l'attivazione.`,
      ctaText: () => `Conferma email`,
      ctaUrlKey: 'confirm_url',
    },
    welcome_google: {
      subject: () => `Benvenuto in UFO LABZ 🛸`,
      preheader: () => `Il tuo account è pronto. Nessuna password richiesta.`,
      headline: (v) => `Benvenuto a bordo, ${v.first_name || 'Atleta'}`,
      body: () => `Hai effettuato l'accesso con Google. Componi il tuo Custom Stack e accumula punti fedeltà fin dal primo ordine.`,
      ctaText: () => `Esplora il negozio`,
      ctaUrlKey: 'shop_url',
    },
    contact_auto_reply: {
      subject: () => `Messaggio ricevuto · UFO LABZ`,
      preheader: () => `Il nostro team svizzero ti risponde entro 24 ore.`,
      headline: () => `Messaggio preso in carico`,
      body: () => `Grazie per averci contattato. Il nostro team di Zurigo esaminerà la tua richiesta e ti risponderà entro 24 ore.`,
      ctaText: () => `Consulta le FAQ`,
      ctaUrlKey: 'faq_url',
    },
    affiliate_approved: {
      subject: () => `Congratulazioni! Sei Ambassador ufficiale UFO LABZ 🛸`,
      preheader: () => `La tua candidatura è approvata. I tuoi link sono attivi.`,
      headline: (v) => `Benvenuto nel team, ${v.first_name || 'Ambassador'}`,
      body: (v) => `Il tuo profilo è attivo. Con il tuo codice personale ${v.coupon_code || ''} guadagni fino al 20% di commissione su ogni vendita generata.`,
      ctaText: () => `Accedi al portale ambassador`,
      ctaUrlKey: 'dashboard_url',
    },
    affiliate_application_received: {
      subject: () => `Candidatura Ambassador ricevuta · UFO LABZ`,
      preheader: () => `Stiamo esaminando il tuo profilo. Risposta entro 48 ore.`,
      headline: () => `Candidatura in revisione`,
      body: () => `Grazie per il tuo interesse per UFO LABZ. Il nostro team valuterà il tuo profilo e ti contatterà entro 48 ore.`,
      ctaText: () => `Scopri di più su UFO LABZ`,
      ctaUrlKey: 'about_url',
    },
    commission_earned: {
      subject: (v) => `Nuova commissione guadagnata: ${v.commission_amount || ''}! 💰`,
      preheader: () => `Un nuovo ordine è stato effettuato con il tuo codice ambassador.`,
      headline: () => `Commissione sbloccata`,
      body: (v) => `Ottime notizie! Un ordine di ${v.order_subtotal || ''} è stato effettuato con il tuo codice. Hai guadagnato ${v.commission_amount || ''} (${v.commission_rate || '15'}%).`,
      ctaText: () => `Vedi i miei guadagni`,
      ctaUrlKey: 'dashboard_url',
    },
    coupon_approved: {
      subject: (v) => `Il tuo codice promo ${v.coupon_code || ''} è approvato!`,
      preheader: () => `Il tuo coupon personalizzato è ora attivo e pronto all'uso.`,
      headline: () => `Codice promo attivo`,
      body: (v) => `Il codice ${v.coupon_code || ''} con il ${v.discount_value || '10%'} di sconto è ora attivo e condivisibile.`,
      ctaText: () => `Vedi i miei codici`,
      ctaUrlKey: 'dashboard_url',
    },
    coupon_rejected: {
      subject: (v) => `Aggiornamento sulla tua richiesta di codice promo`,
      preheader: () => `La richiesta di codice necessita di una revisione.`,
      headline: () => `Codice non approvato`,
      body: (v) => `Il codice richiesto ${v.coupon_code || ''} non è stato approvato: ${v.reject_reason || 'nome già riservato'}. Proponi un nuovo codice dal portale.`,
      ctaText: () => `Proponi un altro codice`,
      ctaUrlKey: 'dashboard_url',
    },
    abandoned_cart: {
      subject: () => `Il tuo stack ti aspetta ancora su UFO LABZ`,
      preheader: () => `Le allocazioni del Lotto 01 sono limitate. Completa il tuo ordine.`,
      headline: (v) => `La tua selezione è riservata, ${v.first_name || 'Atleta'}`,
      body: () => `Hai lasciato delle formule nel tuo carrello di preordine. Lo sconto lancio del 25% e le riduzioni per volume dello stack sono ancora disponibili.`,
      ctaText: () => `Completa il mio preordine`,
      ctaUrlKey: 'cart_url',
    },
    browse_abandonment: {
      subject: () => `Hai individuato una formula d'élite?`,
      preheader: () => `Nutrizione di precisione svizzera senza compromessi.`,
      headline: () => `Eleva i tuoi standard atletici`,
      body: (v) => `Hai recentemente visualizzato ${v.product_name || 'le nostre formule d’élite'}. Dosaggi clinici al 100%, zero eccipienti inutili.`,
      ctaText: () => `Vedi la formula`,
      ctaUrlKey: 'product_url',
    },
    restock_reminder: {
      subject: (v) => `È ora di rinnovare le tue scorte, ${v.first_name || 'Atleta'}?`,
      preheader: () => `Non interrompere il tuo protocollo. Rifornisciti ora.`,
      headline: () => `Mantieni la continuità`,
      body: (v) => `Sono trascorsi circa 45 giorni dal tuo ultimo ordine di ${v.product_name || 'integratori'}. Riordina ora con il 15% di sconto.`,
      ctaText: () => `Riordina ora (-15%)`,
      ctaUrlKey: 'reorder_url',
    },
    win_back: {
      subject: () => `Ci manchi · Ricevi il 15% di sconto sul tuo ritorno`,
      preheader: () => `Scopri le novità svizzere con un vantaggio esclusivo.`,
      headline: (v) => `Torna più forte di prima, ${v.first_name || 'Atleta'}`,
      body: () => `Pronto a spingere al massimo? Usa il codice WELCOMEBACK per sbloccare il 15% di sconto extra sul tuo prossimo ordine.`,
      ctaText: () => `Riscatta il mio 15%`,
      ctaUrlKey: 'shop_url',
    },
    lead_nurture: {
      subject: () => `Il tuo protocollo nutrizionale personalizzato · UFO LABZ`,
      preheader: () => `Scopri la scienza dietro i nostri 10 calcolatori gratuiti.`,
      headline: () => `Ottimizza i tuoi parametri`,
      body: () => `Hai recentemente provato i nostri calcolatori scientifici. Associa i tuoi fabbisogni calcolati a formule svizzere di altissima purezza.`,
      ctaText: () => `Esplora calcolatori e formule`,
      ctaUrlKey: 'tools_url',
    },
    affiliate_reengagement: {
      subject: () => `Aumenta i tuoi guadagni questo mese · UFO LABZ Ambassador`,
      preheader: () => `Nuovi materiali di marketing per incrementare le commissioni.`,
      headline: () => `Nuove opportunità ti aspettano`,
      body: () => `La tua community cerca purezza svizzera. Scarica i nuovi banner e condividi il tuo codice per raggiungere la fascia Ammiraglio Alieno al 20%.`,
      ctaText: () => `Apri portale ambassador`,
      ctaUrlKey: 'dashboard_url',
    },
    admin_new_order: {
      subject: (v) => `[ADMIN] Nuovo ordine #${v.order_number || ''} (${v.total || ''})`,
      preheader: () => `Un nuovo ordine cliente è stato registrato.`,
      headline: () => `Nuovo ordine cliente`,
      body: (v) => `Ordine effettuato da ${v.full_name || ''} (${v.email || ''}). Totale: ${v.total || ''}. Valuta: ${v.currency || ''}. Lingua: ${v.locale || 'it'}.`,
      ctaText: () => `Vedi nell'Admin Dashboard`,
      ctaUrlKey: 'admin_order_url',
    },
    affiliate_application_admin_alert: {
      subject: (v) => `[ADMIN] Nuova candidatura ambassador: ${v.full_name || ''}`,
      preheader: () => `Un atleta ha fatto domanda per il programma ambassador.`,
      headline: () => `Nuova candidatura`,
      body: (v) => `${v.full_name || ''} (${v.email || ''}) ha inviato la candidatura. Social: ${v.social_links || 'Nessuno'}.`,
      ctaText: () => `Esamina nell'Admin`,
      ctaUrlKey: 'admin_affiliate_url',
    },
    coupon_submitted_admin_alert: {
      subject: (v) => `[ADMIN] Richiesta codice promo: ${v.coupon_code || ''}`,
      preheader: () => `Un ambassador ha proposto un nuovo codice sconto.`,
      headline: () => `Proposta codice sconto`,
      body: (v) => `L'ambassador ${v.affiliate_name || ''} richiede il codice: ${v.coupon_code || ''}.`,
      ctaText: () => `Modera nell'Admin`,
      ctaUrlKey: 'admin_coupon_url',
    },
  },
}

export const EMAIL_COMMON_LABELS: Record<Locale, Record<string, string>> = {
  fr: {
    order_number: 'Numéro de commande',
    order_date: 'Date',
    payment_method: 'Paiement',
    delivery_address: 'Adresse de livraison',
    delivery_method: 'Mode de livraison',
    carrier_swiss_post: 'La Poste Suisse (PostPac Priority)',
    subtotal: 'Sous-total',
    launch_discount: 'Remise de lancement Lot 01',
    stack_discount: 'Remise volume Stack',
    shipping: 'Livraison',
    free: 'OFFERTE',
    total: 'Total',
    tagline: 'Technologie de Performance Alien. Suppléments d’élite formulés dans les laboratoires suisses.',
    questions: 'Des questions ?',
    unsubscribe: 'Se désinscrire',
    batch_notice: 'Réservation Lot 01 · Expédition 2e semaine de décembre 2026',
    tracking: 'Numéro de suivi',
  },
  en: {
    order_number: 'Order number',
    order_date: 'Date',
    payment_method: 'Payment',
    delivery_address: 'Delivery address',
    delivery_method: 'Delivery method',
    carrier_swiss_post: 'Swiss Post (PostPac Priority)',
    subtotal: 'Subtotal',
    launch_discount: 'Batch 01 Launch Offer',
    stack_discount: 'Stack Volume Discount',
    shipping: 'Shipping',
    free: 'FREE',
    total: 'Total',
    tagline: 'Alien Performance Technology. Premium supplements engineered in Swiss laboratories.',
    questions: 'Questions?',
    unsubscribe: 'Unsubscribe',
    batch_notice: 'Batch 01 Pre-Order · Ships 2nd week of December 2026',
    tracking: 'Tracking number',
  },
  de: {
    order_number: 'Bestellnummer',
    order_date: 'Datum',
    payment_method: 'Zahlungsmethode',
    delivery_address: 'Lieferadresse',
    delivery_method: 'Versandart',
    carrier_swiss_post: 'Die Schweizerische Post (PostPac Priority)',
    subtotal: 'Zwischensumme',
    launch_discount: 'Einführungsrabatt Charge 01',
    stack_discount: 'Stack-Mengenrabatt',
    shipping: 'Versand',
    free: 'KOSTENLOS',
    total: 'Gesamtsumme',
    tagline: 'Alien Performance Technology. Premium-Supplemente aus Schweizer Laboratorien.',
    questions: 'Fragen?',
    unsubscribe: 'Abmelden',
    batch_notice: 'Charge 01 Vorbestellung · Versand ab 2. Dezemberwoche 2026',
    tracking: 'Sendungsnummer',
  },
  it: {
    order_number: 'Numero ordine',
    order_date: 'Data',
    payment_method: 'Metodo di pagamento',
    delivery_address: 'Indirizzo di consegna',
    delivery_method: 'Modalità di spedizione',
    carrier_swiss_post: 'La Posta Svizzera (PostPac Priority)',
    subtotal: 'Subtotale',
    launch_discount: 'Sconto lancio Lotto 01',
    stack_discount: 'Sconto volume Stack',
    shipping: 'Spedizione',
    free: 'GRATUITA',
    total: 'Totale',
    tagline: 'Alien Performance Technology. Integratori d’élite formulati nei laboratori svizzeri.',
    questions: 'Domande?',
    unsubscribe: 'Disiscriviti',
    batch_notice: 'Preordine Lotto 01 · Spedizione 2a settimana di dicembre 2026',
    tracking: 'Numero di tracciamento',
  },
}

/**
 * Builds localized responsive HTML email template
 */
export function buildLocalizedEmailHtml({
  templateKey,
  locale = 'fr',
  currency = 'CHF',
  variables = {},
  appUrl = 'https://ufolabz.com',
}: {
  templateKey: EmailTemplateKey
  locale?: Locale
  currency?: SupportedCurrency
  variables?: Record<string, any>
  appUrl?: string
}): { subject: string; html: string } {
  const safeLocale: Locale = (['fr', 'en', 'de', 'it'].includes(locale) ? locale : DEFAULT_LOCALE) as Locale
  const dict = EMAIL_DICTIONARY[safeLocale]?.[templateKey] || EMAIL_DICTIONARY[DEFAULT_LOCALE][templateKey]
  const labels = EMAIL_COMMON_LABELS[safeLocale] || EMAIL_COMMON_LABELS[DEFAULT_LOCALE]

  const subject = dict.subject(variables)
  const preheader = dict.preheader(variables)
  const headline = dict.headline(variables)
  const bodyText = dict.body(variables)
  const ctaText = dict.ctaText ? dict.ctaText(variables) : undefined

  // Build locale-aware links
  const targetCtaUrl = dict.ctaUrlKey && variables[dict.ctaUrlKey]
    ? variables[dict.ctaUrlKey]
    : `${appUrl}${getLocalePath('/account', safeLocale)}`

  const shopUrl = `${appUrl}${getLocalePath('/products', safeLocale)}`
  const accountUrl = `${appUrl}${getLocalePath('/account', safeLocale)}`
  const unsubscribeUrl = `${appUrl}${getLocalePath('/account', safeLocale)}`
  const supportEmail = 'hello@ufolabz.com'

  // Items table HTML (for orders, cart, etc.)
  let itemsHtml = ''
  if (Array.isArray(variables.items) && variables.items.length > 0) {
    const itemRows = variables.items.map((item: any) => {
      const canonicalName = getProductDisplayName(item.slug || item.name || '')
      const flavor = item.variantName || item.flavor ? ` (${item.variantName || item.flavor})` : ''
      const qty = item.quantity || item.qty || 1
      const priceStr = typeof item.price === 'number'
        ? formatCurrencyPrice(item.price * qty, currency)
        : item.price || ''

      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #26262f;font:600 14px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">
          ${canonicalName}${flavor} &times; ${qty}
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid #26262f;font:600 14px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">
          ${priceStr}
        </td>
      </tr>`
    }).join('')

    const subtotalStr = variables.subtotal || ''
    const discountStr = variables.discount ? `<tr>
      <td style="padding:6px 0;font:400 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#9b9bab;">${labels.launch_discount}</td>
      <td align="right" style="padding:6px 0;font:600 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1fff6b;">&minus;${variables.discount}</td>
    </tr>` : ''
    const shippingStr = variables.shipping || labels.free
    const totalStr = variables.total || ''

    itemsHtml = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
        ${itemRows}
        ${subtotalStr ? `<tr>
          <td style="padding:8px 0 4px;font:400 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#9b9bab;">${labels.subtotal}</td>
          <td align="right" style="padding:8px 0 4px;font:600 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">${subtotalStr}</td>
        </tr>` : ''}
        ${discountStr}
        <tr>
          <td style="padding:4px 0;font:400 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#9b9bab;">${labels.shipping}</td>
          <td align="right" style="padding:4px 0;font:600 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">${shippingStr}</td>
        </tr>
        <tr>
          <td style="padding:14px 0 0;font:700 16px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">${labels.total}</td>
          <td align="right" style="padding:14px 0 0;font:800 18px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1fff6b;">${totalStr}</td>
        </tr>
      </table>
    `
  }

  // Details table (Order number, Date, Address, etc.)
  let detailsHtml = ''
  if (variables.order_number) {
    detailsHtml = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 20px;border-top:1px solid #26262f;border-bottom:1px solid #26262f;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a22;font:400 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#9b9bab;">${labels.order_number}</td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #1a1a22;font:600 14px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">${variables.order_number}</td>
        </tr>
        ${variables.order_date ? `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a22;font:400 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#9b9bab;">${labels.order_date}</td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #1a1a22;font:600 14px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">${variables.order_date}</td>
        </tr>` : ''}
        ${variables.payment_method ? `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a22;font:400 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#9b9bab;">${labels.payment_method}</td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #1a1a22;font:600 14px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">${variables.payment_method}</td>
        </tr>` : ''}
        ${variables.shipping_address ? `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a22;font:400 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#9b9bab;">${labels.delivery_address}</td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #1a1a22;font:600 14px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">${variables.shipping_address}</td>
        </tr>` : ''}
        ${variables.tracking_number ? `<tr>
          <td style="padding:10px 0;font:400 13px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#9b9bab;">${labels.tracking}</td>
          <td align="right" style="padding:10px 0;font:700 14px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1fff6b;">${variables.tracking_number}</td>
        </tr>` : ''}
      </table>
    `
  }

  const ctaButtonHtml = ctaText
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 24px;">
        <tr>
          <td style="background:#1fff6b;border-radius:10px;">
            <a href="${targetCtaUrl}" style="display:inline-block;padding:14px 30px;font:700 15px 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#03140a;text-decoration:none;letter-spacing:0.2px;">
              ${ctaText}
            </a>
          </td>
        </tr>
      </table>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="${safeLocale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#07070a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#07070a;">
    <tr>
      <td align="center" style="padding:32px 14px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#111116;border:1px solid #26262f;border-radius:16px;overflow:hidden;">
          <!-- Neon accent line -->
          <tr><td style="height:3px;background:#1fff6b;font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding:32px 32px 10px;">
              <a href="${shopUrl}">
                <img src="https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794414758/ufoloabz-logo_etekla.png" alt="UFO LABZ" width="150" style="display:block;border:0;height:auto;max-width:150px;">
              </a>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:20px 36px 12px;">
              <h1 style="margin:0 0 16px;font:800 24px/1.3 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ffffff;letter-spacing:-0.3px;">
                ${headline}
              </h1>
              <p style="margin:0 0 16px;font:400 15px/1.65 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">
                ${bodyText}
              </p>

              <!-- Batch 01 Pre-order Banner Notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
                <tr>
                  <td style="background:#0c0c11;border:1px solid #26262f;border-left:3px solid #1fff6b;border-radius:8px;padding:12px 16px;font:500 13px/1.5 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ececf2;">
                    ${labels.batch_notice}
                  </td>
                </tr>
              </table>

              ${detailsHtml}
              ${itemsHtml}
              ${ctaButtonHtml}

              <p style="margin:16px 0 0;font:400 13px/1.6 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#9b9bab;">
                ${labels.questions} <a href="mailto:${supportEmail}" style="color:#1fff6b;text-decoration:none;">${supportEmail}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:8px 36px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #26262f;">
                <tr>
                  <td style="padding-top:22px;font:400 12px/1.7 'Helvetica Neue',Helvetica,Arial,sans-serif;color:#9b9bab;" align="center">
                    <img src="https://res.cloudinary.com/dm4jfxbcs/image/upload/v1794414786/ufolabz-logo_for_header_mobile_ns7zn1.jpg" alt="UFO LABZ" width="80" style="border:0;height:auto;margin-bottom:8px;"><br>
                    ${labels.tagline}<br>
                    <a href="https://www.instagram.com/ufolabz_official" style="color:#ececf2;text-decoration:none;">Instagram</a> &nbsp;|&nbsp; 
                    <a href="https://facebook.com/ufolabz" style="color:#ececf2;text-decoration:none;">Facebook</a> &nbsp;|&nbsp; 
                    <a href="https://youtube.com/@ufolabz" style="color:#ececf2;text-decoration:none;">YouTube</a><br>
                    &copy; ${new Date().getFullYear()} UFO LABZ GmbH &middot; Bahnhofstrasse 100, 8001 Z&uuml;rich, Switzerland<br>
                    <a href="${unsubscribeUrl}" style="color:#9b9bab;text-decoration:underline;">${labels.unsubscribe}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return {
    subject,
    html,
  }
}
