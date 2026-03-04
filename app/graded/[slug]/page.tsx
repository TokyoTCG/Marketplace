import { notFound } from 'next/navigation';
import { cardData } from '@/lib/cardData';
import GradedCardDetail from './GradedCardDetail';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = cardData.find(c => c.slug === slug);
  if (!card) return notFound();
  return <GradedCardDetail card={card} />;
}
