import PreOrderClient from '@/components/preorder/PreOrderClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pre-Order Policy & Guarantee | UFO LABZ Switzerland',
  description:
    'Read the official UFO LABZ Pre-Order Terms, Batch 01 dispatch timelines, Swiss shipping details, and our 100% full refund cancellation guarantee.',
}

export default function PreOrderPolicyPage() {
  return <PreOrderClient />
}
