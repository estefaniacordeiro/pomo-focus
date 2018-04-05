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
    totalSessions: 4,
    modalOpen: false,
  },

  stats: {
    '03292018': [
      { endedAt: 'timestamp', task: 'task', focusTime: 30 }
    ],
    '03302018': [
      { endedAt: 'timestamp', task: 'task', focusTime: 30 } 
    ]
  },

  tasks: [
    { name: 'name', 
      _id: 'adsfjasdfjlasd',
      lastUpdated: 1347234789, 
      stats: {
        totalMinutes: 100,
        'date': [
          {endedAt: 'timestamp', focusTime: 30 },
        ]
      }
    }
  ],

  common: {
    user: "123@gmail.com",
    token: "adsfjljl",
    inProgress: false,
    redirectTo: null,
    error: null
  }
  


}
