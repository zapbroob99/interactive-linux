export const intro = {
  title: "Introduction",
  items: [
    {
      id: "intro-1",
      title: "Taking Back Control",
      content: `
### A Story... 
William Shotts begins his book with the story of how you can take back control of your computer. In the Linux world, **freedom** means knowing exactly what your computer is doing.

**Say Hello to the System:**
Let's take the first step into this free world by querying your kernel information.
      `,
      setupCommands: ["clear"],
      tasks: [
        { 
          id: "t1", 
          text: "Type 'uname -a' to see system information.", 
          trigger: "uname -a", 
          checkType: "input", 
          completed: false 
        },
        { 
          id: "t2", 
          text: "Check how long the system has been running using 'uptime'.", 
          trigger: "uptime", 
          checkType: "input", 
          completed: false 
        }
      ]
    }
  ]
};