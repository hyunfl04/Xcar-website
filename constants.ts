
import { Car } from './types';

export const INITIAL_CARS: Car[] = [
  {
    id: '1',
    name: 'Chiron Pur Sport',
    brand: 'BUGATTI',
    acceleration: '2.3s',
    power: '1500 HP',
    price: 3500000,
    description: 'The ultimate driving machine designed for lateral acceleration and precision.',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000',
    category: 'Hypercar'
  },
  {
    id: '2',
    name: 'Aventador SVJ',
    brand: 'LAMBORGHINI',
    acceleration: '2.8s',
    power: '770 HP',
    price: 517700,
    description: 'A masterpiece of engineering and aesthetics, built for the track and the road.',
    imageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf048?auto=format&fit=crop&q=80&w=1000',
    category: 'Supercar'
  },
  {
    id: '3',
    name: 'SF90 Stradale',
    brand: 'FERRARI',
    acceleration: '2.5s',
    power: '1000 HP',
    price: 625000,
    description: 'The first ever Ferrari to feature Plug-in Hybrid Electric Vehicle architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1000',
    category: 'Hybrid'
  }
];
