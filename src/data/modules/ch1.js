export const ch1 = {
  title: "Chapter 1 - What Is The Shell?",
  items: [
    {
      id: "ch1-1",
      title: "The Shell, Terminal, and Prompt",
      bookSection: "Chapter 1: What Is The Shell? / Terminal Emulators",
      concepts: ["shell", "terminal emulator", "bash", "prompt"],
      content: `
### The Shell Is Your Command Interpreter

The shell is the program that reads commands from the keyboard and asks the operating system to run them. Most Linux distributions use **bash**, the Bourne Again Shell.

The window you type into is a **terminal emulator**. It gives you a screen and keyboard connection to the shell, but it is not the shell itself.

When the shell is ready, it prints a **prompt**. A normal user prompt usually ends with \`$\`; an administrative prompt usually ends with \`#\`. The prompt is the shell's way of saying, "I am ready for your next command."

This module implements the book's opening explanation of the shell, terminal emulator, and prompt.
      `,
      setupCommands: ["clear"],
      tasks: [
        {
          id: "t1-1",
          text: "Run 'whoami' to ask which user owns this shell session.",
          trigger: "whoami",
          checkType: "input",
          completed: false
        },
        {
          id: "t1-2",
          text: "Run 'pwd' to print the current working directory shown by the shell.",
          trigger: "pwd",
          checkType: "input",
          completed: false
        }
      ]
    },
    {
      id: "ch1-2",
      title: "Your First Keystrokes",
      bookSection: "Chapter 1: Your First Keystrokes",
      concepts: ["typing commands", "Enter", "command not found", "reading errors"],
      content: `
### Mistakes Are Useful Feedback

The first command you type does not have to be correct. If the shell cannot find a program by that name, it prints an error such as \`command not found\` and gives you the prompt again.

That behavior is important: the shell is not guessing. It runs exact commands, reports exact failures, and waits for you to try again.

This module implements the book's first hands-on moment: typing a few characters, pressing Enter, and observing the response.
      `,
      setupCommands: ["clear"],
      tasks: [
        {
          id: "t1-3",
          text: "Type a nonsense command such as 'hello' and make the shell report that it was not found.",
          trigger: "command not found",
          checkType: "output",
          completed: false
        },
        {
          id: "t1-4",
          text: "Recover by running a real command: 'echo ready'.",
          trigger: "echo ready",
          checkType: "input",
          completed: false
        }
      ]
    },
    {
      id: "ch1-3",
      title: "Command History and Editing",
      bookSection: "Chapter 1: Command History / Cursor Movement",
      concepts: ["command history", "line editing", "arrow keys", "history"],
      content: `
### The Shell Remembers the Session

Bash keeps a command history during the session. The Up and Down arrow keys move through previous commands, and the Left and Right arrow keys move the cursor inside the current command line.

The book introduces these editing habits early because they make command-line work faster and less repetitive. In this browser lab, the most reliable way to verify the idea is to inspect the history list directly.

This module implements the book's command history and cursor movement section with commands that can be checked automatically.
      `,
      setupCommands: ["clear", "echo first-history-command", "echo second-history-command", "clear"],
      tasks: [
        {
          id: "t1-5",
          text: "Run 'history' to display commands remembered by the current shell session.",
          trigger: "history",
          checkType: "input",
          completed: false
        },
        {
          id: "t1-6",
          text: "Run 'echo edited-command' after practicing cursor movement on the command line.",
          trigger: "echo edited-command",
          checkType: "input",
          completed: false
        }
      ]
    },
    {
      id: "ch1-4",
      title: "A Few Simple Commands",
      bookSection: "Chapter 1: Try Some Simple Commands",
      concepts: ["date", "cal", "df", "free", "reading output"],
      content: `
### Ask the System Simple Questions

The book's first practical command set is small but useful:

- \`date\` prints the current date and time.
- \`cal\` displays a calendar.
- \`df\` reports free space on mounted file systems.
- \`free\` reports memory usage.

Do not try to memorize every column yet. The goal is to build the habit of entering commands and reading output as feedback from the system.

This module implements the book's "Try Some Simple Commands" section.
      `,
      setupCommands: ["clear"],
      tasks: [
        { id: "t1-7", text: "Display the current date and time with 'date'.", trigger: "date", checkType: "input", completed: false },
        { id: "t1-8", text: "Display a calendar with 'cal'.", trigger: "cal", checkType: "input", completed: false },
        { id: "t1-9", text: "Check disk space with 'df'.", trigger: "df", checkType: "input", completed: false },
        { id: "t1-10", text: "Check memory usage with 'free'.", trigger: "free", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch1-5",
      title: "Ending a Terminal Session",
      bookSection: "Chapter 1: Ending A Terminal Session / The Console Behind The Curtain",
      concepts: ["exit", "terminal session", "virtual terminals", "console"],
      content: `
### Close the Conversation Cleanly

A terminal session is a conversation with the shell. When you are done, close that conversation with \`exit\`.

The book also points out that Linux can provide text-only virtual terminals outside the graphical desktop. This embedded browser lab keeps you inside one terminal window, but the concept is the same: a terminal gives you access to a shell session.

This module implements the book's session-ending section and briefly captures the virtual console idea.
      `,
      setupCommands: ["clear"],
      tasks: [
        {
          id: "t1-11",
          text: "Run 'echo session-complete' to confirm you are ready to close the shell.",
          trigger: "echo session-complete",
          checkType: "input",
          completed: false
        },
        {
          id: "t1-12",
          text: "End the shell session by typing 'exit'.",
          trigger: "exit",
          checkType: "input",
          completed: false
        }
      ]
    }
  ]
};
