class TerminalEmulator
{
    /**
     *
     * @param elem
     * @param height
     * @param width
     * @param bgColor
     * @param textColor
     */
     constructor(elem, height, width, bgColor="black", textColor="lightgrey")
     {
        // css init
        this.mElement           = elem
        this.mBgColor           = bgColor
        this.mTextColor         = textColor
        this.mHeight            = height
        this.mWidth             = width
        this.mCursorPosition    = { 'x': 0, 'y': 0 }
        this.mScreen            = new Array( this.height )  // holds character data
        this.mCursorVisible     = true;
        this.mScrollTopOffset   = 0                         // This class attribute defines the scroll offset from
                                                            // newsest line (bottom) to top. 0 on new line
        this.initCss()
        this.initMatrix()
        this.render()
        this.initCursor()
        this.enableKeyboardInput()
        //this.disableKeyboardInput()
        //this.handleKeyboardInput()
        //this.enableArrowKeyCursorNavigation()
        //this.disableArrowKeyCursorNavigation()

        this.element.addEventListener('read', (event) => {
            console.log('read')
            //let clipboardData = event.clipboardData || window.clipboardData || event.originalEvent.clipboardData;
            //this.puts( window.clipboardData.getData('Text') )
        })


         /*
         this.element.addEventListener('contextmenu', function(ev) {
             ev.preventDefault();
             alert('success!');
             return false;
         }, false);
         */
     }

    /**
     *
     * @returns {*}
     */
    get element()                   { return this.mElement }

    /**
     *
     * @returns {*[]}
     */
    get screen()                    { return this.mScreen }

    /**
     *
     * @returns {*|{x: number, y: number}}
     */
    get cursorPosition()            { return this.mCursorPosition }

    /**
     *
     * @param y
     * @param x
     * @param char
     * @returns {string}
     */
    getCharacterCell( y, x, char )  { return '<span class="console-cell" id="'+y+'-'+x+'">'+char+'</span>' }

    /**
     *
     * @returns {string}
     */
    get bgColor()                   { return this.mBgColor }

    /**
     *
     * @returns {string}
     */
    get textColor()                 { return this.mTextColor }

    /**
     *
     * @returns {*}
     */
    get height()                    { return this.mHeight }

    /**
     *
     * @returns {*}
     */
    get width()                     { return this.mWidth }

    /**
     *
     *
     * @returns {boolean}
     */
    get cursorVisible()             { return this.mCursorVisible }

    /**
     *
     * @param visible
     */
    set cursorVisible( visible )    { this.mCursorVisible = visible }

    get scrollTopOffset()           { return this.mScrollTopOffset }
    set scrollTopOffset(offset)     { this.mScrollTopOffset = offset }

    //
    // Init
    //

    /**
     *
     */
    initCss() {
        this.mElement.style.height           = (this.height * 16)+'px';
        this.mElement.style.width            = (this.width * 8)+'px';
        this.mElement.style.fontFamily       = 'ModernDOS8x16';
        this.mElement.style.fontSize         = '1rem';
        this.mElement.style.margin           = '0';
        this.mElement.style.padding          = '0';
        this.mElement.style.lineHeight       = '1rem';
        this.mElement.style.backgroundColor  = 'black';
        this.mElement.style.color            = 'lightgrey';
        this.mElement.style.lineBreak        = 'anywhere';
        this.mElement.style.whiteSpace       = 'break-spaces';
        this.mElement.style.padding          = '2px';
    }

    /**
     *
     */
    initMatrix()
    {
        for( let i = 0; i < this.height; i++ )
            this.screen[i] = new Array(this.width)

        for( let i = 0; i < this.height; i++ )
            for( let j = 0; j < this.width; j++ )
                this.screen[i][j] = ' '

        this.render()
    }

    /**
     *
     */
    initCursor()
    {
        setInterval( () => {
            let index = this.cursorPosition.y+'-'+this.cursorPosition.x
            let character = document.getElementById( index )
            if( character )
            {
                if( this.cursorVisible )
                {
                    character.style.backgroundColor = this.textColor
                    character.style.color = this.bgColor
                }
                else
                {
                    character.style.backgroundColor = this.bgColor
                    character.style.color = this.textColor
                }
                this.cursorVisible = !this.cursorVisible
            }

        }, 500);
    }

    fixCursor()
    {
        let index = this.cursorPosition.y+'-'+this.cursorPosition.x
        let character = document.getElementById(index)
        /*
        character.style.backgroundColor = this.textColor
        character.style.color = this.bgColor
        character.style.backgroundColor = this.bgColor
        index = this.cursorPosition.y+'-'+this.cursorPosition.x
        character = document.getElementById(index)

        .demo if(!t){i=(d=document).createElement('input');i.type='text';b=d.createElement('button');b.onclick=()=>{r=d.createRange();r.selectNode(d.querySelector('input'));(w=window).getSelection().removeAllRanges();w.getSelection().addRange(r);d.execCommand('copy');w.getSelection().removeAllRanges()};b.innerHTML='copy';d.body.innerHTML='';(E=d.body).appendChild(i,b),E.appendChild(b),i.focus()}
        */
        let cells = document.querySelectorAll( 'div#main span.console-cell:not([data-value="'+index+'"])' )
        console.log(cells)
        for( let i = 0; i< cells.length; i++)
        {
            cells[i].removeAttribute('style')
            let index = this.cursorPosition.y+'-'+this.cursorPosition.x
            let character = document.getElementById(index)
            character.style.backgroundColor = this.textColor
            character.style.color = this.bgColor
        }

        document.querySelectorAll( 'div#main' )

    }

    /**
     *
     */
    enableKeyboardInput()
    {
        document.addEventListener('keypress', (e) => {
            this.scrollTopOffset = 0            // jump back to cursor
            if (e.key.length === 1)
            {
                this.put( e.key )
                this.fixCursor()
            }
            else if (e.key === 'Enter')
            {
                if (this.cursorPosition.y > this.screen.length - 1)
                {
                    this.cursorPosition.y = this.screen.length
                }
                else if (this.cursorPosition.y === this.screen.length - 1)
                {
                    this.addRow()
                }
                this.cursorPosition.x = 0
                this.cursorPosition.y++
            }
        });

        document.addEventListener('keydown', async (e) => {
            if (e.key === 'Backspace')
            {
                if (this.cursorPosition.x > 0)
                {
                    this.screen[this.cursorPosition.y][this.cursorPosition.x-1] = ' '
                    this.cursorPosition.x--
                    this.render()
                }
            }

            //
            // ctl
            //

            if ( e.key === 'x' && e.ctrlKey === true )
            {
                this.initMatrix();
                this.cursorPosition.y = 0
                this.cursorPosition.x = 0
                this.render()
            }
            else if ( e.key === 'c' && e.ctrlKey === true )
            {
                const event = new Event('read');
                this.element.dispatchEvent(event);
            }


            if( e.key === 'PageUp' )
            {
                console.log( this.screen.length - this.height)
                if( this.screen.length - this.height > this.scrollTopOffset )
                    this.scrollTopOffset++
                this.render()
            }
            else if( e.key === 'PageDown' )
            {
                if( this.scrollTopOffset > 0 )
                    this.scrollTopOffset--
                this.render()
            }
        })

        document.addEventListener( 'paste', function(event)
        {
            console.log(event.data)
        })
    }


    /**
     *
     */
    enableArrowKeyCursorNavigation()
    {
        document.addEventListener('keyup', (e) => {
            if( e.key === 'ArrowLeft')
            {
                if( this.cursorPosition.x > 0 )
                    this.cursorPosition.x--
            }
            else if( e.key === 'ArrowRight')
            {
                if( this.cursorPosition.x < this.screen[this.cursorPosition.y].length-1 )
                    this.cursorPosition.x++
            }
            else if( e.key === 'ArrowDown')
            {
                if( this.cursorPosition.y < this.screen[this.cursorPosition.y].length-1 )
                    this.cursorPosition.y++
            }
            else if( e.key === 'ArrowUp')
            {
                if( this.cursorPosition.y > 0 )
                    this.cursorPosition.y--
            }

        })
    }

    //
    // INPUT/OUTPUT
    //

    /**
     *
     */
    addRow()
    {
        this.screen.push( [] )
        this.screen[this.screen.length-1] = new Array( this.width )
        for( let i = 0; i < this.width; i++ )
        {
            this.screen[this.screen.length-1][i] = ' '
        }
    }

    /**
     *
     */
    clear()
    {
        this.element.innerText = ''
    }

    /**
     *
     */
    render()
    {
        this.clear()
        let str = ''
        for( let i = 0; i < this.height; i++ )
            for( let j = 0; j < this.width; j++ )
            {
                let y = this.screen.length-this.height+i-this.scrollTopOffset // give this thing a name
                let x = j
                let currentPosChar = this.screen[y][x]
                str += this.getCharacterCell( y, x, currentPosChar )
            }

        this.element.innerHTML = str
    }

    /**
     *
     * @param char
     */
    put( char ) {

        if( this.cursorPosition.x === this.width )
        {
            this.cursorPosition.y++
            this.cursorPosition.x = 0
            if (this.cursorPosition.y === this.screen.length - 1)
            {
                this.addRow()
            }
        }
        else
        {
            document.getElementById( (this.cursorPosition.y)+'-'+(this.cursorPosition.x)).innerText = char[0]
            this.screen[this.cursorPosition.y][this.cursorPosition.x] = char[0]
            this.cursorPosition.x++
        }

    }

    /**
     *
     * @param str
     */
    puts( str )
    {
        for( let i = 0; i < str.length; i++ )
            this.put( str[i] )
        this.render()
    }
}


