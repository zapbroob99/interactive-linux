export const ch4 = {
  title: "Chapter 4 – Manipulating Files and Directories",
  items: [
    {
      id: "ch4-1",
      title: "Wildcards (Globbing)",
      content: `
### The Power of Patterns 🃏
Before moving files, we must understand **Wildcards**. They allow you to select groups of filenames based on patterns.

**Common Wildcards:**
- \`*\`: Matches any characters.
- \`?\`: Matches any single character.
- \`[characters]\`: Matches any character in the set (e.g., \`[abc]\`).
- \`[!characters]\`: Matches any character NOT in the set.
- \`[[:class:]]\`: Matches characters in a specific class (e.g., \`[:digit:]\`, \`[:lower:]\`, \`[:alnum:]\`).



**Examples:**
- \`g*\`: Files starting with 'g'.
- \`b*.txt\`: Files starting with 'b', ending in '.txt'.
- \`Data???\`: 'Data' followed by exactly 3 characters.
      `,
      setupCommands: ["mkdir -p playground/dir1 playground/dir2", "touch playground/test1.txt playground/test2.txt playground/data.log"],
      tasks: [
        { id: "t4-1", text: "List all files starting with 't': 'ls t*'", trigger: "ls t*", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch4-2",
      title: "mkdir & cp (Create and Copy)",
      content: `
### Creating and Copying 📂
- **mkdir**: Creates directories. You can create multiple at once: \`mkdir dir1 dir2\`.
- **cp**: Copies files or directories.

**Useful cp Options:**
- \`-a\`: Archive (preserves permissions and attributes).
- \`-i\`: Interactive (asks before overwriting).
- \`-r\`: Recursive (required for copying directories).
- \`-u\`: Update (only copies files that are newer or don't exist in destination).

**Task:** Create a 'backup' directory and copy a file into it.
      `,
      setupCommands: ["cd ~/playground", "touch file1.txt"],
      tasks: [
        { id: "t4-2", text: "Create directory 'backup': 'mkdir backup'", trigger: "mkdir backup", checkType: "input", completed: false },
        { id: "t4-3", text: "Copy file1.txt to backup: 'cp file1.txt backup/'", trigger: "cp file1.txt backup/", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch4-3",
      title: "mv & rm (Move and Remove)",
      content: `
### Move, Rename, and Delete 🧹
- **mv**: Performs both moving and renaming.
- **rm**: Removes files and directories. ⚠️ **Warning:** Linux has no 'undelete'. Once it's gone, it's gone.

**The rm Danger:**
A simple space can be fatal: \`rm * .html\` (deletes everything!) instead of \`rm *.html\`. Always test with \`ls\` first.

**Options:**
- \`rm -r\`: Deletes a directory and its contents.
- \`rm -rf\`: Force delete (use with extreme caution).
      `,
      setupCommands: ["cd ~/playground", "touch oldname.txt"],
      tasks: [
        { id: "t4-4", text: "Rename 'oldname.txt' to 'newname.txt': 'mv oldname.txt newname.txt'", trigger: "mv oldname.txt newname.txt", checkType: "input", completed: false },
        { id: "t4-5", text: "Delete 'newname.txt' interactively: 'rm -i newname.txt'", trigger: "rm -i newname.txt", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch4-4",
      title: "Hard and Symbolic Links",
      content: `
### Linking Files 🔗
**Hard Links:**
- An additional name for a file.
- Cannot reference directories or files on different disk partitions.
- Indistinguishable from the original file.

**Symbolic (Soft) Links:**
- A special file that points to another file/directory (like a shortcut).
- Can span different physical devices.
- If the original file is deleted, the link becomes "broken".



**Commands:**
- \`ln file link\`: Create Hard Link.
- \`ln -s item link\`: Create Symbolic Link.
      `,
      setupCommands: ["cd ~/playground", "echo 'Hello' > original.txt"],
      tasks: [
        { id: "t4-6", text: "Create a symlink: 'ln -s original.txt shortcut.txt'", trigger: "ln -s original.txt shortcut.txt", checkType: "input", completed: false },
        { id: "t4-7", text: "Check inodes: 'ls -li'", trigger: "ls -li", checkType: "input", completed: false }
      ]
    },
    {
      id: "ch4-5",
      title: "The Playground Project",
      content: `
### Lab: Putting it all together 🛠️
Let's practice the "Playground" exercise from the book. We will create a structure, copy system files, and manipulate them.

**Steps:**
1. Go home.
2. Create 'playground'.
3. Copy \`/etc/passwd\` into it.
4. Rename it and move it around.
      `,
      setupCommands: ["cd ~"],
      tasks: [
        { id: "t4-8", text: "Create playground: 'mkdir playground'", trigger: "mkdir playground", checkType: "input", completed: false },
        { id: "t4-9", text: "Copy passwd to current dir: 'cp /etc/passwd .'", trigger: "cp /etc/passwd .", checkType: "input", completed: false },
        { id: "t4-10", text: "Rename passwd to fun: 'mv passwd fun'", trigger: "mv passwd fun", checkType: "input", completed: false }
      ]
    }
  ]
};