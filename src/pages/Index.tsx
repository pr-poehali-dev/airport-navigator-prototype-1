import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';

type LocationType = 'gate' | 'cafe' | 'toilet' | 'escalator' | 'stairs' | 'info' | 'current';

interface Location {
  id: string;
  name: string;
  type: LocationType;
  x: number;
  y: number;
}

interface RouteStep {
  instruction: string;
  distance: string;
}

const locations: Location[] = [
  { id: 'current', name: 'Вы здесь', type: 'current', x: 30, y: 70 },
  { id: 'cafe1', name: 'Кафе Starbucks', type: 'cafe', x: 45, y: 55 },
  { id: 'toilet1', name: 'Туалет', type: 'toilet', x: 38, y: 50 },
  { id: 'escalator1', name: 'Эскалатор', type: 'escalator', x: 52, y: 45 },
  { id: 'stairs1', name: 'Лестница', type: 'stairs', x: 60, y: 38 },
  { id: 'info1', name: 'Стойка информации', type: 'info', x: 68, y: 32 },
  { id: 'cafe2', name: 'Кафе Costa', type: 'cafe', x: 75, y: 28 },
  { id: 'toilet2', name: 'Туалет', type: 'toilet', x: 78, y: 22 },
  { id: 'gate-b15', name: 'Выход B15', type: 'gate', x: 85, y: 15 },
];

const routeSteps: RouteStep[] = [
  { instruction: 'Идите прямо по главному коридору', distance: '150 м' },
  { instruction: 'Пройдите мимо кафе Starbucks справа', distance: '80 м' },
  { instruction: 'Поверните налево у стойки информации', distance: '60 м' },
  { instruction: 'Поднимитесь по эскалатору', distance: '40 м' },
  { instruction: 'Продолжайте прямо мимо кафе Costa', distance: '70 м' },
  { instruction: 'Выход B15 будет справа', distance: '50 м' },
];

const cafe1 = locations.find(l => l.id === 'cafe1')!;
const escalator1 = locations.find(l => l.id === 'escalator1')!;
const info1 = locations.find(l => l.id === 'info1')!;
const cafe2 = locations.find(l => l.id === 'cafe2')!;

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoute, setShowRoute] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.toLowerCase().includes('b15') || query.toLowerCase().includes('выход')) {
      const destination = locations.find(loc => loc.id === 'gate-b15');
      setSelectedDestination(destination || null);
      setShowRoute(true);
    } else {
      setShowRoute(false);
      setSelectedDestination(null);
    }
  };

  const currentLocation = locations.find(loc => loc.type === 'current');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="px-4 pt-6 pb-3 bg-white border-b">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold">Навигатор</h1>
            <Icon name="Menu" size={24} className="text-gray-600" />
          </div>
          
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Введите гейт или локацию"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 py-6 text-base rounded-xl border-gray-200"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowRoute(false);
                  setSelectedDestination(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Icon name="X" size={20} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
          <div className="absolute inset-0 p-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              
              <rect width="100" height="100" fill="url(#grid)" />

              {showRoute && currentLocation && selectedDestination && (
                <>
                  <path
                    d={`M ${currentLocation.x} ${currentLocation.y} 
                        L ${currentLocation.x + 10} ${currentLocation.y - 10}
                        L ${currentLocation.x + 15} ${currentLocation.y - 12}
                        L ${cafe1.x} ${cafe1.y}
                        L ${escalator1.x} ${escalator1.y}
                        L ${info1.x} ${info1.y}
                        L ${cafe2.x} ${cafe2.y}
                        L ${selectedDestination.x} ${selectedDestination.y}`}
                    fill="none"
                    stroke="#11F5F9"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-fade-in"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(17, 245, 249, 0.6))' }}
                  />
                  
                  <circle cx={currentLocation.x} cy={currentLocation.y} r="1.5" fill="#11F5F9" className="animate-pulse" />
                  <circle cx={selectedDestination.x} cy={selectedDestination.y} r="1.5" fill="#11F5F9" className="animate-pulse" />
                </>
              )}

              {locations.map((location) => {
                const isHighlighted = showRoute && (
                  location.type === 'cafe' || 
                  location.type === 'escalator' || 
                  location.type === 'info' ||
                  location.type === 'toilet' ||
                  location.type === 'stairs'
                );

                return (
                  <g key={location.id}>
                    {isHighlighted && (
                      <circle
                        cx={location.x}
                        cy={location.y}
                        r="3"
                        fill="rgba(17, 245, 249, 0.2)"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={location.x}
                      cy={location.y}
                      r="2"
                      fill={location.type === 'current' ? '#ef4444' : 
                            location.type === 'gate' ? '#22c55e' :
                            location.type === 'cafe' ? '#f59e0b' :
                            location.type === 'toilet' ? '#3b82f6' :
                            location.type === 'escalator' ? '#a855f7' :
                            location.type === 'stairs' ? '#6366f1' :
                            '#06b6d4'}
                      className={isHighlighted ? 'animate-scale-in' : ''}
                    />
                    <text
                      x={location.x}
                      y={location.y - 3}
                      fontSize="3"
                      fill="#1e293b"
                      textAnchor="middle"
                      className="font-medium"
                      style={{ userSelect: 'none' }}
                    >
                      {location.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              <rect x="10" y="10" width="30" height="15" fill="white" stroke="#e5e7eb" strokeWidth="0.5" rx="1" />
              <rect x="60" y="10" width="25" height="20" fill="white" stroke="#e5e7eb" strokeWidth="0.5" rx="1" />
              <rect x="15" y="80" width="35" height="12" fill="white" stroke="#e5e7eb" strokeWidth="0.5" rx="1" />
            </svg>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-3 bg-white/95 backdrop-blur-sm border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-sm">Легенда</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Выход</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span>Кафе</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Туалет</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Эскалатор</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span>Инфо</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Вы здесь</span>
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
                  <h2 className="text-lg font-semibold">{selectedDestination.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="Clock" size={16} />
                      <span>~7 минут</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="Route" size={16} />
                      <span>450 м</span>
                    </div>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Icon name="Navigation" size={20} className="text-primary" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[200px]">
              <div className="px-4 py-3">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Пошаговая инструкция</h3>
                <div className="space-y-3">
                  {routeSteps.map((step, index) => (
                    <div key={index} className="flex gap-3 group">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-primary">{index + 1}</span>
                        </div>
                        {index < routeSteps.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="text-sm text-gray-800">{step.instruction}</p>
                        <p className="text-xs text-gray-500 mt-1">{step.distance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <div className="px-4 py-3 border-t border-gray-100">
              <Button className="w-full rounded-xl h-12 text-base font-medium">
                <Icon name="Navigation" size={20} className="mr-2" />
                Начать навигацию
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-around py-3 bg-white border-t border-gray-200">
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
            <Icon name="Route" size={22} className={showRoute ? 'text-primary' : 'text-gray-400'} />
            <span className={`text-xs ${showRoute ? 'text-primary font-medium' : 'text-gray-500'}`}>Маршрут</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
            <Icon name="Map" size={22} className="text-primary" />
            <span className="text-xs text-primary font-medium">Карта</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
            <Icon name="Search" size={22} className="text-gray-400" />
            <span className="text-xs text-gray-500">Поиск</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
