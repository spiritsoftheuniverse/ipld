$(document).ready(function(){
        $('.tocbox a').off().on('click touchstart',function(){
                highlighttext( $('.tocbox a'), false, false);
                highlighttext( $(this), true, true);
                showdata($(this).attr('data'));
        });
})
function showdata(d) {
    console.log("Loading:", d);

    fetch(`html/${d}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Network error");
            return response.text();
        })
        .then(html => {
            // do something with the loaded HTML
            document.querySelector("#contentdata").innerHTML = html;
        })
        .catch(err => {
            console.error("Failed to load:", err);
        });
}

function highlighttext(e, bold=false, highlight = true)
{
        if(highlight)
        {
                e.addClass('highlighted');
                if(e.hasClass('toggleButton'))
                {
                        e.css('border-style', 'dotted');
                }
                if(bold)
                {
                        e.css('font-weight', 'bold');
                }
        }
        else{
                if(e.hasClass('toggleButton'))
                {
                        e.css('border-style', 'solid');
                }
                
                e.removeClass('highlighted').css('font-weight', 'normal');
        }
}