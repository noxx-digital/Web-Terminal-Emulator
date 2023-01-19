# Web Terminal Emulator

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Terminal Emulator</title>

  <link href="modern_dos/modern-dos.css" rel="stylesheet" type="text/css">
  <link href="TerminalEmulator.js" rel="stylesheet" type="text/css">
  <link href="main.css" rel="stylesheet" type="text/css">

  <script>
    let elem = document.getElementById( 'terminal' )     
    const terminalEmulator = new TerminalEmulator( elem, 40, 80 )
  </script>
</head>
<body>

  <div id="terminal"></div>

  <script src="TerminalEmulator.js"></script>
</body>
</html>
```

```css
body
{
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

main.screen {
    width: 100%;
    height: 100%;
    background-color: black;
    color: greenyellow;
    font-family: monospace, "ModernDOS8x16";

    font-size: 1rem;
    white-space: initial;
    margin: 0;
    padding: 0;
    line-height: 1rem;
}

.blink {
    animation: blinker 1s step-start infinite;
}

@keyframes blinker {
    50% {
        opacity: 0;
    }
}

textarea#main *
{
    display: none;
}
```


