User = {
  username: 'name',
  email: 'abc@gmail.com',
  hash: String,
  salt: String,

  settings: {
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsGoal: 4
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
  ],

  stats: {
    'date': [
      { timestamp: 'timestamp', task: 'task', focusTime: 30 }
    ]
  }

}