import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

type LocationType = 'gate' | 'cafe' | 'toilet' | 'escalator' | 'stairs' | 'info' | 'current' | 'checkin' | 'security' | 'duty-free' | 'atm' | 'pharmacy' | 'waiting';

interface Location {
  id: string;
  name: string;
  type: LocationType;
  x: number;
  y: number;
  floor: number;
}

interface RouteStep {
  instruction: string;
  distance: string;
  icon: string;
}

const locations: Location[] = [
  { id: 'entrance', name: 'Вход в терминал', type: 'current', x: 15, y: 85, floor: 1 },
  { id: 'info-desk', name: 'Информация', type: 'info', x: 20, y: 78, floor: 1 },
  { id: 'checkin-1', name: 'Стойка регистрации A', type: 'checkin', x: 28, y: 75, floor: 1 },
  { id: 'checkin-2', name: 'Стойка регистрации B', type: 'checkin', x: 35, y: 75, floor: 1 },
  { id: 'cafe-1', name: 'Бургер Кинг', type: 'cafe', x: 25, y: 70, floor: 1 },
  { id: 'toilet-1', name: 'Туалет', type: 'toilet', x: 32, y: 68, floor: 1 },
  { id: 'atm-1', name: 'Банкомат', type: 'atm', x: 38, y: 70, floor: 1 },
  { id: 'security', name: 'Досмотр', type: 'security', x: 45, y: 65, floor: 1 },
  { id: 'pharmacy', name: 'Аптека', type: 'pharmacy', x: 50, y: 60, floor: 1 },
  { id: 'duty-free-1', name: 'Duty Free', type: 'duty-free', x: 55, y: 58, floor: 1 },
  { id: 'cafe-2', name: 'Шоколадница', type: 'cafe', x: 58, y: 52, floor: 1 },
  { id: 'toilet-2', name: 'Туалет', type: 'toilet', x: 62, y: 55, floor: 1 },
  { id: 'escalator-1', name: 'Эскалатор вверх', type: 'escalator', x: 68, y: 50, floor: 1 },
  { id: 'waiting-1', name: 'Зона ожидания', type: 'waiting', x: 72, y: 45, floor: 1 },
  { id: 'cafe-3', name: 'Costa Coffee', type: 'cafe', x: 75, y: 40, floor: 1 },
  { id: 'toilet-3', name: 'Туалет', type: 'toilet', x: 78, y: 35, floor: 1 },
  { id: 'atm-2', name: 'Банкомат', type: 'atm', x: 80, y: 30, floor: 1 },
  { id: 'gate-a12', name: 'Выход A12', type: 'gate', x: 85, y: 25, floor: 1 },
];

const routeSteps: RouteStep[] = [
  { instruction: 'От входа в терминал пройдите к стойке информации', distance: '25 м', icon: 'ArrowRight' },
  { instruction: 'Следуйте к зоне регистрации, стойки A-B слева', distance: '40 м', icon: 'ArrowRight' },
  { instruction: 'Пройдите мимо Бургер Кинг справа', distance: '35 м', icon: 'ArrowRight' },
  { instruction: 'Туалет будет слева, банкомат справа', distance: '30 м', icon: 'ArrowRight' },
  { instruction: 'Пройдите через зону досмотра безопасности', distance: '45 м', icon: 'ShieldCheck' },
  { instruction: 'После досмотра — аптека слева', distance: '25 м', icon: 'ArrowRight' },
  { instruction: 'Пройдите мимо Duty Free справа', distance: '40 м', icon: 'ArrowRight' },
  { instruction: 'Кафе Шоколадница слева, туалет справа', distance: '35 м', icon: 'ArrowRight' },
  { instruction: 'Поднимитесь на эскалаторе на уровень выходов', distance: '50 м', icon: 'MoveUp' },
  { instruction: 'Пройдите через зону ожидания', distance: '60 м', icon: 'ArrowRight' },
  { instruction: 'Costa Coffee слева, продолжайте прямо', distance: '40 м', icon: 'ArrowRight' },
  { instruction: 'Туалет справа, банкомат чуть дальше', distance: '30 м', icon: 'ArrowRight' },
  { instruction: 'Выход A12 будет справа по коридору', distance: '50 м', icon: 'Target' },
];

const getLocationColor = (type: LocationType) => {
  const colorMap = {
    gate: '#22c55e',
    cafe: '#f59e0b',
    toilet: '#3b82f6',
    escalator: '#a855f7',
    stairs: '#6366f1',
    info: '#06b6d4',
    current: '#ef4444',
    checkin: '#ec4899',
    security: '#14b8a6',
    'duty-free': '#f97316',
    atm: '#84cc16',
    pharmacy: '#10b981',
    waiting: '#8b5cf6',
  };
  return colorMap[type];
};

const getLocationLabel = (type: LocationType) => {
  const labelMap = {
    gate: 'Выход',
    cafe: 'Кафе',
    toilet: 'WC',
    escalator: '↑',
    stairs: '↕',
    info: 'i',
    current: '●',
    checkin: '✓',
    security: '🛡',
    'duty-free': '$',
    atm: '₽',
    pharmacy: '+',
    waiting: '⌛',
  };
  return labelMap[type];
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('A12');
  const [showRoute, setShowRoute] = useState(true);
  const [selectedDestination] = useState<Location>(locations.find(l => l.id === 'gate-a12')!);

  const currentLocation = locations.find(loc => loc.id === 'entrance')!;

  const pathPoints = [
    currentLocation,
    locations.find(l => l.id === 'info-desk')!,
    locations.find(l => l.id === 'checkin-1')!,
    locations.find(l => l.id === 'cafe-1')!,
    locations.find(l => l.id === 'toilet-1')!,
    locations.find(l => l.id === 'atm-1')!,
    locations.find(l => l.id === 'security')!,
    locations.find(l => l.id === 'pharmacy')!,
    locations.find(l => l.id === 'duty-free-1')!,
    locations.find(l => l.id === 'cafe-2')!,
    locations.find(l => l.id === 'toilet-2')!,
    locations.find(l => l.id === 'escalator-1')!,
    locations.find(l => l.id === 'waiting-1')!,
    locations.find(l => l.id === 'cafe-3')!,
    locations.find(l => l.id === 'toilet-3')!,
    locations.find(l => l.id === 'atm-2')!,
    selectedDestination,
  ];

  const pathD = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="px-4 pt-6 pb-3 bg-white border-b">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-semibold">Навигатор</h1>
              <p className="text-xs text-gray-500">Терминал D · Этаж 1</p>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200">
              <Icon name="MapPin" size={14} className="mr-1" />
              Активен
            </Badge>
          </div>
          
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Выход A12"
              value={searchQuery}
              readOnly
              className="pl-10 pr-10 py-6 text-base rounded-xl border-gray-200 bg-gray-50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="Navigation" size={20} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-gray-50 overflow-hidden">
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-white/95 backdrop-blur-sm text-gray-700 border-gray-200">
              <Icon name="Layers" size={12} className="mr-1" />
              1 этаж
            </Badge>
          </div>

          <div className="absolute inset-0 p-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#e5e7eb" strokeWidth="0.3" opacity="0.4"/>
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              
              <rect width="100" height="100" fill="url(#grid)" />

              <rect x="5" y="5" width="90" height="90" fill="none" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2,2" rx="2" />

              {showRoute && (
                <>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-fade-in"
                    style={{ filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.5))' }}
                  />
                  
                  {pathPoints.map((point, idx) => (
                    <circle
                      key={idx}
                      cx={point.x}
                      cy={point.y}
                      r="0.8"
                      fill="#3b82f6"
                      className="animate-pulse"
                      opacity="0.6"
                    />
                  ))}
                </>
              )}

              {locations.map((location) => {
                const isOnRoute = pathPoints.some(p => p.id === location.id);
                const color = getLocationColor(location.type);

                return (
                  <g key={location.id}>
                    {isOnRoute && (
                      <circle
                        cx={location.x}
                        cy={location.y}
                        r="2.5"
                        fill={color}
                        opacity="0.15"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={location.x}
                      cy={location.y}
                      r="1.5"
                      fill={color}
                      stroke="white"
                      strokeWidth="0.3"
                      className={isOnRoute ? 'animate-scale-in' : ''}
                    />
                    <text
                      x={location.x}
                      y={location.y - 2.5}
                      fontSize="2.2"
                      fill="#1e293b"
                      textAnchor="middle"
                      className="font-semibold"
                      style={{ userSelect: 'none' }}
                    >
                      {location.name.length > 15 ? location.name.substring(0, 12) + '...' : location.name}
                    </text>
                  </g>
                );
              })}

              <text x="50" y="95" fontSize="2.5" fill="#94a3b8" textAnchor="middle" className="font-medium">
                Терминал D · Московский аэропорт Шереметьево
              </text>
            </svg>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-3 bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Map" size={16} className="text-gray-600" />
                <h3 className="font-semibold text-sm">Легенда карты</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Выход на посадку</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span>Кафе/рестораны</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Туалеты</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Эскалатор</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span>Информация</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  <span>Регистрация</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span>Досмотр</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>Duty Free</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {showRoute && selectedDestination && (
          <div className="bg-white border-t border-gray-200 animate-slide-in-right">
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-semibold">Маршрут до {selectedDestination.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="Clock" size={16} />
                      <span>~12 минут</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="Route" size={16} />
                      <span>~540 м</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      13 точек
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[200px]">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Пошаговая инструкция</h3>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">
                    <Icon name="Volume2" size={14} className="mr-1" />
                    Озвучить
                  </Button>
                </div>
                <div className="space-y-2.5">
                  {routeSteps.map((step, index) => (
                    <div key={index} className="flex gap-2.5 group">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                          <span className="text-xs font-semibold text-primary">{index + 1}</span>
                        </div>
                        {index < routeSteps.length - 1 && (
                          <div className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-primary/10 my-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex items-start gap-2">
                          <p className="text-sm text-gray-800 leading-snug">{step.instruction}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{step.distance}</span>
                          <Badge variant="secondary" className="text-xs h-5 px-1.5">
                            <Icon name={step.icon as any} size={10} className="mr-0.5" />
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-green-50">
              <Button className="w-full rounded-xl h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                <Icon name="Navigation" size={20} className="mr-2" />
                Начать навигацию
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-around py-3 bg-white border-t border-gray-200">
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
            <Icon name="Route" size={22} className="text-primary" />
            <span className="text-xs text-primary font-medium">Маршрут</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
            <Icon name="Map" size={22} className="text-primary" />
            <span className="text-xs text-primary font-medium">Карта</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
            <Icon name="List" size={22} className="text-gray-400" />
            <span className="text-xs text-gray-500">Точки</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
