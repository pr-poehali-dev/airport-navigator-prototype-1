import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

type LocationType = 'gate' | 'cafe' | 'toilet' | 'escalator' | 'stairs' | 'info' | 'current' | 'checkin' | 'security' | 'duty-free' | 'pharmacy' | 'waiting';

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
  { id: 'current', name: 'Вы здесь', type: 'current', x: 12, y: 85, floor: 1 },
  { id: 'info-1', name: 'Информация', type: 'info', x: 18, y: 78, floor: 1 },
  { id: 'cafe-starbucks', name: 'Starbucks', type: 'cafe', x: 25, y: 72, floor: 1 },
  { id: 'toilet-1', name: 'Туалет М/Ж', type: 'toilet', x: 32, y: 66, floor: 1 },
  { id: 'escalator-1', name: 'Эскалатор ↑', type: 'escalator', x: 38, y: 59, floor: 1 },
  { id: 'cafe-burger', name: 'Burger King', type: 'cafe', x: 44, y: 53, floor: 1 },
  { id: 'stairs-1', name: 'Лестница', type: 'stairs', x: 50, y: 47, floor: 1 },
  { id: 'toilet-2', name: 'Туалет', type: 'toilet', x: 56, y: 41, floor: 1 },
  { id: 'info-2', name: 'Стойка информации', type: 'info', x: 62, y: 36, floor: 1 },
  { id: 'duty-free', name: 'Duty Free', type: 'duty-free', x: 67, y: 31, floor: 1 },
  { id: 'cafe-costa', name: 'Costa Coffee', type: 'cafe', x: 72, y: 26, floor: 1 },
  { id: 'pharmacy', name: 'Аптека', type: 'pharmacy', x: 77, y: 21, floor: 1 },
  { id: 'toilet-3', name: 'Туалет', type: 'toilet', x: 82, y: 16, floor: 1 },
  { id: 'waiting', name: 'Зона ожидания', type: 'waiting', x: 86, y: 12, floor: 1 },
  { id: 'gate-b15', name: 'Выход B15', type: 'gate', x: 90, y: 8, floor: 1 },
];

const routeSteps: RouteStep[] = [
  { instruction: 'Идите прямо по главному коридору в сторону стойки информации', distance: '50 м', icon: 'ArrowUp' },
  { instruction: 'Пройдите мимо Starbucks слева', distance: '60 м', icon: 'ArrowRight' },
  { instruction: 'Туалет будет справа, продолжайте движение', distance: '45 м', icon: 'ArrowUp' },
  { instruction: 'Поднимитесь на эскалаторе на второй уровень', distance: '40 м', icon: 'MoveUp' },
  { instruction: 'После эскалатора Burger King будет слева', distance: '50 м', icon: 'ArrowRight' },
  { instruction: 'Пройдите мимо лестницы справа', distance: '35 м', icon: 'ArrowUp' },
  { instruction: 'Туалет слева, стойка информации впереди', distance: '40 м', icon: 'ArrowRight' },
  { instruction: 'Поверните налево у стойки информации', distance: '30 м', icon: 'ArrowLeft' },
  { instruction: 'Пройдите мимо Duty Free справа', distance: '45 м', icon: 'ArrowUp' },
  { instruction: 'Costa Coffee слева, продолжайте прямо', distance: '50 м', icon: 'ArrowRight' },
  { instruction: 'Аптека будет справа, двигайтесь к зоне вылета', distance: '40 м', icon: 'ArrowUp' },
  { instruction: 'Пройдите через зону ожидания', distance: '35 м', icon: 'ArrowRight' },
  { instruction: 'Выход B15 будет справа по коридору', distance: '30 м', icon: 'Target' },
];

const getLocationColor = (type: LocationType): string => {
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
    pharmacy: '#10b981',
    waiting: '#8b5cf6',
  };
  return colorMap[type];
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoute, setShowRoute] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);
  const [expandedDetails, setExpandedDetails] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.toLowerCase().includes('b15') || query.toLowerCase().includes('выход b')) {
      const destination = locations.find(loc => loc.id === 'gate-b15');
      setSelectedDestination(destination || null);
      setShowRoute(true);
    } else {
      setShowRoute(false);
      setSelectedDestination(null);
    }
  };

  const currentLocation = locations.find(loc => loc.type === 'current')!;

  const pathPoints = showRoute ? [
    currentLocation,
    locations.find(l => l.id === 'info-1')!,
    locations.find(l => l.id === 'cafe-starbucks')!,
    locations.find(l => l.id === 'toilet-1')!,
    locations.find(l => l.id === 'escalator-1')!,
    locations.find(l => l.id === 'cafe-burger')!,
    locations.find(l => l.id === 'stairs-1')!,
    locations.find(l => l.id === 'toilet-2')!,
    locations.find(l => l.id === 'info-2')!,
    locations.find(l => l.id === 'duty-free')!,
    locations.find(l => l.id === 'cafe-costa')!,
    locations.find(l => l.id === 'pharmacy')!,
    locations.find(l => l.id === 'toilet-3')!,
    locations.find(l => l.id === 'waiting')!,
    selectedDestination!,
  ] : [];

  const pathD = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="px-5 pt-6 pb-4 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Навигатор</h1>
              <p className="text-sm text-gray-500 mt-0.5">Терминал D, Шереметьево</p>
            </div>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Icon name="Settings" size={22} className="text-gray-600" />
            </Button>
          </div>
          
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <Input
              placeholder="Введите гейт или локацию"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-12 py-6 text-base rounded-2xl border-gray-200 shadow-sm focus:shadow-md transition-shadow bg-gray-50/50 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowRoute(false);
                  setSelectedDestination(null);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
              >
                <Icon name="X" size={20} className="text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>

          {!searchQuery && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {['Выход B15', 'Туалет', 'Кафе', 'Duty Free'].map((quick) => (
                <Button
                  key={quick}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(quick)}
                  className="rounded-full text-xs whitespace-nowrap border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  {quick}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 relative bg-gradient-to-br from-blue-50/30 to-slate-50 overflow-hidden">
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            <Badge className="bg-white shadow-md text-gray-700 border border-gray-200 px-3 py-1.5">
              <Icon name="Layers" size={14} className="mr-1.5" />
              Этаж 1
            </Badge>
            <Badge className="bg-white shadow-md text-blue-600 border border-blue-200 px-3 py-1.5">
              <Icon name="MapPin" size={14} className="mr-1.5" />
              Вы здесь
            </Badge>
          </div>

          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="rounded-xl shadow-md bg-white hover:bg-gray-50 w-10 h-10">
              <Icon name="Plus" size={20} className="text-gray-700" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-xl shadow-md bg-white hover:bg-gray-50 w-10 h-10">
              <Icon name="Minus" size={20} className="text-gray-700" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-xl shadow-md bg-white hover:bg-gray-50 w-10 h-10">
              <Icon name="Locate" size={20} className="text-blue-600" />
            </Button>
          </div>

          <div className="absolute inset-0 p-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="0" cy="0" r="0.3" fill="#cbd5e1" opacity="0.3"/>
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <rect width="100" height="100" fill="url(#grid)" />

              <rect x="8" y="5" width="84" height="85" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="3,2" rx="1.5" opacity="0.6" />
              <line x1="8" y1="40" x2="92" y2="40" stroke="#cbd5e1" strokeWidth="0.3" strokeDasharray="2,1" opacity="0.4" />
              <line x1="50" y1="5" x2="50" y2="90" stroke="#cbd5e1" strokeWidth="0.3" strokeDasharray="2,1" opacity="0.4" />

              {showRoute && pathPoints.length > 0 && (
                <>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className="animate-fade-in"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    style={{
                      animation: 'drawPath 2s ease-out forwards'
                    }}
                  />
                  
                  {pathPoints.map((point, idx) => (
                    <g key={idx}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="2.5"
                        fill={getLocationColor(point.type)}
                        opacity="0.2"
                        className="animate-pulse"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="1"
                        fill="url(#routeGradient)"
                        className="animate-pulse"
                      />
                    </g>
                  ))}
                </>
              )}

              {locations.map((location) => {
                const isOnRoute = showRoute && pathPoints.some(p => p.id === location.id);
                const color = getLocationColor(location.type);
                const scale = isOnRoute ? 1.2 : 1;

                return (
                  <g 
                    key={location.id} 
                    className="cursor-pointer transition-transform hover:scale-110"
                    transform={`scale(${scale})`}
                    style={{ transformOrigin: `${location.x}px ${location.y}px` }}
                  >
                    {isOnRoute && (
                      <>
                        <circle
                          cx={location.x}
                          cy={location.y}
                          r="4"
                          fill={color}
                          opacity="0.15"
                          className="animate-ping"
                        />
                        <circle
                          cx={location.x}
                          cy={location.y}
                          r="3.5"
                          fill={color}
                          opacity="0.25"
                        />
                      </>
                    )}
                    
                    <circle
                      cx={location.x}
                      cy={location.y}
                      r="2.5"
                      fill="white"
                      stroke={color}
                      strokeWidth="0.6"
                      filter={isOnRoute ? "url(#glow)" : ""}
                    />
                    <circle
                      cx={location.x}
                      cy={location.y}
                      r="1.8"
                      fill={color}
                    />
                    
                    {location.type === 'current' && (
                      <circle
                        cx={location.x}
                        cy={location.y}
                        r="1"
                        fill="white"
                        className="animate-pulse"
                      />
                    )}
                    
                    <text
                      x={location.x}
                      y={location.y - 4}
                      fontSize="2.5"
                      fontWeight="600"
                      fill="#1e293b"
                      textAnchor="middle"
                      className="pointer-events-none"
                      style={{ 
                        userSelect: 'none',
                        textShadow: '0 0 3px white, 0 0 3px white'
                      }}
                    >
                      {location.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {!showRoute && (
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="p-4 bg-white/95 backdrop-blur-md border-gray-200 shadow-xl rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Map" size={18} className="text-gray-600" />
                  <h3 className="font-semibold text-sm">Условные обозначения</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                  {[
                    { type: 'gate', label: 'Выходы на посадку' },
                    { type: 'cafe', label: 'Кафе и рестораны' },
                    { type: 'toilet', label: 'Туалеты' },
                    { type: 'escalator', label: 'Эскалаторы' },
                    { type: 'stairs', label: 'Лестницы' },
                    { type: 'info', label: 'Информация' },
                    { type: 'duty-free', label: 'Duty Free' },
                    { type: 'pharmacy', label: 'Аптека' },
                  ].map(({ type, label }) => (
                    <div key={type} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
                        style={{ backgroundColor: getLocationColor(type as LocationType) }}
                      />
                      <span className="text-gray-700">{label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        {showRoute && selectedDestination && (
          <div className="bg-white border-t border-gray-100 shadow-2xl animate-slide-in-bottom">
            <div 
              className="px-5 py-4 cursor-pointer"
              onClick={() => setExpandedDetails(!expandedDetails)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getLocationColor(selectedDestination.type) }}
                    />
                    <h2 className="text-lg font-bold text-gray-900">{selectedDestination.name}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Icon name="Clock" size={16} className="text-blue-600" />
                      <span className="font-semibold text-gray-700">~7 минут</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Icon name="Route" size={16} className="text-purple-600" />
                      <span className="font-semibold text-gray-700">450 м</span>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                      14 точек
                    </Badge>
                  </div>
                </div>
                <Icon 
                  name={expandedDetails ? "ChevronDown" : "ChevronUp"} 
                  size={24} 
                  className="text-gray-400"
                />
              </div>
            </div>

            {expandedDetails && (
              <div className="border-t border-gray-100">
                <ScrollArea className="h-[280px]">
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Icon name="Navigation" size={16} className="text-blue-600" />
                        Пошаговая навигация
                      </h3>
                      <Button size="sm" variant="ghost" className="h-8 text-xs">
                        <Icon name="Volume2" size={14} className="mr-1.5" />
                        Озвучить
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {routeSteps.map((step, index) => (
                        <div key={index} className="flex gap-3 group hover:bg-blue-50/50 rounded-lg p-2 -mx-2 transition-colors">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                              <span className="text-xs font-bold text-white">{index + 1}</span>
                            </div>
                            {index < routeSteps.length - 1 && (
                              <div className="w-0.5 flex-1 min-h-[24px] bg-gradient-to-b from-blue-300 to-purple-300 my-1"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-1">
                            <p className="text-sm text-gray-800 leading-relaxed font-medium">{step.instruction}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge variant="outline" className="text-xs h-6 px-2 border-gray-300">
                                <Icon name="Footprints" size={12} className="mr-1 text-gray-600" />
                                {step.distance}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>

                <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <Button className="w-full rounded-xl h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-200">
                    <Icon name="Navigation" size={20} className="mr-2" />
                    Начать навигацию
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-around py-3 bg-white border-t border-gray-100">
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 px-4">
            <Icon name="Route" size={22} className={showRoute ? "text-blue-600" : "text-gray-400"} />
            <span className={`text-xs font-medium ${showRoute ? "text-blue-600" : "text-gray-500"}`}>Маршрут</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 px-4">
            <Icon name="Map" size={22} className="text-gray-400" />
            <span className="text-xs text-gray-500">Карта</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 px-4">
            <Icon name="List" size={22} className="text-gray-400" />
            <span className="text-xs text-gray-500">Услуги</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 px-4">
            <Icon name="User" size={22} className="text-gray-400" />
            <span className="text-xs text-gray-500">Профиль</span>
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes slide-in-bottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-bottom {
          animation: slide-in-bottom 0.4s ease-out;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}