store = {
  timmer: {
    min: 25,
    mode: 'focus' || 'short-break' || 'long-break',
    
    ticking: true || false,
    currentSession: 0
  },

  settings: {
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    totalSessions: 4
  },

  stats: {
    '03292018': [
      { timestamp: 'timestamp', task: 'task', focusTime: 30 }
    ],
    '03302018': [
      { timestamp: 'timestamp', task: 'task', focusTime: 30 } 
    ]
  },

  tasks: [
    { name: 'name', lastUpdated: 1347234789, 
      stats: {
        totalMinutes: 100,
        'date': [
          {timestamp: 'timestamp', focusTime: 30 },
        ]
      }
    }
  ]
  


}
