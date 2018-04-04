
browser.runtime.onMessage.addListener(handleKeynav);

var keynavDiv = null;
var selectStack = [];

function intersectRect(r1, r2)
{
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

function configureKeynavDiv(rect)
{
    if( keynavDiv )
    {
        keynavDiv.style.top = rect.y + 'px';
        keynavDiv.style.left = rect.x + 'px';
        keynavDiv.style.width = rect.width + 'px';
        keynavDiv.style.height = rect.height + 'px';
    }
}

function stopKeynav()
{
    if( keynavDiv )
    {
        keynavDiv.remove();
        keynavDiv = null;
    }
    selectStack = [];
}

function handleKeynav(message)
{
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

    if( message.keynav == "toggle" )
    {
        if( selectStack.length > 1 )
        {
            configureKeynavDiv(selectStack[selectStack.length - 2]);
            selectStack.pop();
        }
        else if( keynavDiv )
        {
            stopKeynav();
        }
        else
        {
            keynavDiv = document.createElement('div');
            keynavDiv.style.position = 'absolute';
    		keynavDiv.style.border = '1px solid red';
            keynavDiv.style.margin = '0';
            keynavDiv.style.padding = '0';
    		document.body.appendChild(keynavDiv);
            var selectRect = new DOMRect(scrollLeft, scrollTop, document.documentElement.clientWidth - 2, document.documentElement.clientHeight - 2 );
            configureKeynavDiv(selectRect);
            selectStack.push( selectRect );
        }
    }
    else if( keynavDiv )
    {
        var lastRect = selectStack[ selectStack.length - 1 ];
        var newSelectRect = new DOMRect( lastRect.x, lastRect.y, lastRect.width, lastRect.height );
        if( message.keynav == "up" ) {
            newSelectRect.height -= newSelectRect.height / 2;
        } else if( message.keynav == "down" ) {
            newSelectRect.y += newSelectRect.height / 2;
            newSelectRect.height -= newSelectRect.height / 2;
        } else if( message.keynav == "left" ) {
            newSelectRect.width -= newSelectRect.width / 2;
        } else if( message.keynav == "right" ) {
            newSelectRect.x += newSelectRect.width / 2;
            newSelectRect.width -= newSelectRect.width / 2;
        }

        configureKeynavDiv(newSelectRect);
        selectStack.push( newSelectRect );

        var links = document.getElementsByTagName("a");
        var intersectedLink = null;
        for( var i=0, max=links.length; i<max; ++i )
        {
            var linkRect = links[i].getBoundingClientRect();
            linkRect.x += scrollLeft;
            linkRect.y += scrollTop;
            if( intersectRect(linkRect, newSelectRect) )
            {
                if( intersectedLink )
                {
                    return;
                }
                intersectedLink = links[i];
            }
        }

        if( intersectedLink )
        {
//            intersectedLink.style.color = "red";
            //intersectedLink.addClass("");
            intersectedLink.click();
        }
    }
}
