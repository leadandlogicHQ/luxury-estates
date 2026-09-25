import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.inquiry.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.property.deleteMany();
  await prisma.agent.deleteMany();

  const agent1 = await prisma.agent.create({
    data: {
      id: 'agent-1',
      name: 'John Smith',
      title: 'Founder & CEO',
      phone: '(310) 555-0199',
      email: 'john@luxuryestates.com',
      photo: 'EMP1.webp',
      bio: '20+ years in luxury real estate.',
    },
  });
  const agent2 = await prisma.agent.create({
    data: {
      id: 'agent-2',
      name: 'Sarah Johnson',
      title: 'Lead Agent, Beverly Hills',
      phone: '(310) 555-0188',
      email: 'sarah@luxuryestates.com',
      photo: 'EMP2.webp',
      bio: 'Specialist in Beverly Hills estates.',
    },
  });
  const agent3 = await prisma.agent.create({
    data: {
      id: 'agent-3',
      name: 'Michael Chen',
      title: 'Luxury Specialist, East Coast',
      phone: '(310) 555-0166',
      email: 'michael@luxuryestates.com',
      photo: 'EMP4.webp',
      bio: 'Expert in historic properties.',
    },
  });
  const agent4 = await prisma.agent.create({
    data: {
      id: 'agent-4',
      name: 'Emily Davis',
      title: 'Director of Client Relations',
      phone: '(310) 555-0177',
      email: 'emily@luxuryestates.com',
      photo: 'EMP3.webp',
      bio: 'Ensures every client experience is seamless.',
    },
  });

  await prisma.property.createMany({
    data: [
      {
        title: 'Oceanfront Cliff Villa',
        address: '123 Ocean Drive',
        city: 'Malibu',
        state: 'CA',
        zip: '90265',
        price: 2450000,
        beds: 4,
        baths: 3,
        sqft: 3200,
        status: 'For Sale',
        type: 'Villa',
        built: 2018,
        image: 'villa-exterior.webp',
        images: ['villa-exterior.webp', 'Card-1.webp', 'property2.webp'],
        description: 'Luxury oceanfront villa in Malibu.',
        features: ['Infinity pool', 'Ocean view'],
        lat: 34.0259,
        lng: -118.7798,
        agentId: agent1.id,
      },
      {
        title: 'Manhattan Luxury Penthouse',
        address: '500 Fifth Avenue',
        city: 'New York',
        state: 'NY',
        zip: '10110',
        price: 3850000,
        beds: 3,
        baths: 3.5,
        sqft: 2800,
        status: 'For Sale',
        type: 'Penthouse',
        built: 2015,
        image: 'property2.webp',
        images: ['property2.webp', 'Card-2.webp'],
        description: 'Luxury penthouse in NYC.',
        features: ['Skyline view', 'Terrace'],
        lat: 40.7549,
        lng: -73.9840,
        agentId: agent2.id,
      },
      {
        title: 'Waterfront Modern Estate',
        address: '45 Lake Shore Drive',
        city: 'Miami',
        state: 'FL',
        zip: '33101',
        price: 5200000,
        beds: 5,
        baths: 4.5,
        sqft: 4500,
        status: 'For Sale',
        type: 'Estate',
        built: 2020,
        image: 'property3.webp',
        images: ['property3.webp', 'Card-1.webp'],
        description: 'Extraordinary waterfront estate.',
        features: ['Private deep-water dock', 'Resort-style pool'],
        lat: 25.7617,
        lng: -80.1918,
        agentId: agent1.id,
      },
      {
        title: 'Historic Back Bay Mansion',
        address: '77 Commonwealth Ave',
        city: 'Boston',
        state: 'MA',
        zip: '02116',
        price: 4500000,
        beds: 6,
        baths: 5,
        sqft: 5800,
        status: 'For Sale',
        type: 'Mansion',
        built: 1895,
        image: 'property4.webp',
        images: ['property4.webp', 'property2.webp'],
        description: 'Magnificent Victorian-era mansion.',
        features: ['Historic landmark', 'Restored grand staircase'],
        lat: 42.3505,
        lng: -71.0779,
        agentId: agent3.id,
      },
      {
        title: 'Mountain Cliff Retreat',
        address: '789 Summit Ridge',
        city: 'Aspen',
        state: 'CO',
        zip: '81611',
        price: 1850000,
        beds: 4,
        baths: 3,
        sqft: 2900,
        status: 'For Sale',
        type: 'Retreat',
        built: 2019,
        image: 'property5.webp',
        images: ['property5.webp', 'Card-1.webp'],
        description: 'Dramatic modern retreat in Aspen.',
        features: ['Cliff-edge infinity pool', 'Panoramic mountain views'],
        lat: 39.1911,
        lng: -106.8175,
        agentId: agent2.id,
      },
      {
        title: 'Sunset Oceanfront Villa',
        address: '321 Beachfront Ave',
        city: 'Malibu',
        state: 'CA',
        zip: '90265',
        price: 6800000,
        beds: 5,
        baths: 5,
        sqft: 5200,
        status: 'For Sale',
        type: 'Villa',
        built: 2021,
        image: 'property6.webp',
        images: ['property6.webp', 'villa-exterior.webp'],
        description: 'The ultimate Malibu trophy property.',
        features: ['Direct beach access', 'Sculptural infinity pool'],
        lat: 34.0359,
        lng: -118.6892,
        agentId: agent4.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });