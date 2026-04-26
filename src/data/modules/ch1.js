export const ch1 = {
  title: "Chapter 1 – What Is The Shell?",
  items: [
    {
      id: "ch1-1",
      title: "The Shell and Terminal",
      content: `
### What Is The Shell? 🐚
The shell is a program that takes keyboard commands and passes them to the operating system to carry out. Most Linux distributions use **bash**.

**The Prompt:**
- \`$\` symbol: Indicates a normal user.
- \`#\` symbol: Indicates superuser (root) privileges.

**Let's make a mistake:**
Try typing something nonsensical to see how the shell responds to an unknown command.
      `,
      setupCommands: ["clear"],
      tasks: [
        { 
          id: "t1-1", 
          text: "Type a random string (e.g., 'hello') and observe the error.", 
          trigger: "command not found", 
          checkType: "output", 
          completed: false 
        }
      ]
    },
    {
      id: "ch1-2",
      title: "Basic Commands",
      content: `
### Your First Real Commands 🚀
Here are four fundamental commands to query system information: \`date\`, \`cal\`, \`df\`, and \`free\`.
      `,
      setupCommands: ["clear"],
      tasks: [
        { id: "t1-3", text: "Display the current date (date).", trigger: "date", checkType: "input", completed: false },
        { id: "t1-4", text: "View the calendar (cal).", trigger: "cal", checkType: "input", completed: false },
        { id: "t1-5", text: "Check disk space usage (df).", trigger: "df", checkType: "input", completed: false },
        { id: "t1-6", text: "View free memory (free).", trigger: "free", checkType: "input", completed: false }
      ]
    }
  ]
};