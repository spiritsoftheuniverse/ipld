$(document).ready(function(){
        $('.tocbox a').off().on('click touchstart',function(){
                highlighttext( $('.tocbox a'), false, false);
                highlighttext( $(this), true, true);
                showdata($(this).attr('data'));
        });
})
function showdata(d, contentbox = 'contentdata') {
    console.log("Loading:", d);
        const base = `https://spiritsoftheuniverse.github.io/ipld/`;
    fetch(`${base}html/${d}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Network error");
            return response.text();
        })
        .then(html => {
            // do something with the loaded HTML
            document.querySelector("#"+contentbox).innerHTML = html;
            makehtmlevents(contentbox);
        })
        .catch(err => {
            console.error("Failed to load:", err);
        });
}
function makehtmlevents(contentbox)
{
        $('#schemadata').css('display', 'none');
        $('#contentdata').css('display', 'none');
        $('#'+contentbox).css('display', 'flex');
        switch (contentbox) {
                case 'contentdata':

                break;
                case 'schemadata':
                break;
        }
        $('.schemalink').off().on('click touchstart',function(){
                let id = $(this).attr('data')
                console.log(id);
                showdata('schemas/'+id, 'schemadata');
        });
        $('.returnlink').off().on('click touchstart',function(){
                $('#schemadata').css('display', 'none');
                $('#contentdata').css('display', 'flex');
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
function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
}
function updateSingleScrollBorder(scrollElement) {
        if (!scrollElement) return;
        const hasScrollbar = scrollElement.scrollHeight > scrollElement.clientHeight;
        scrollElement.classList.toggle('has-scrollbar', hasScrollbar);
        scrollElement.classList.toggle('scrollbar', hasScrollbar);
}
document.addEventListener('DOMContentLoaded', () => {

        // --- Debounced function to update ALL tables ---
        // Used only for global events like window resize.
        const debouncedUpdateAllBorders = debounce(() => {
                document.querySelectorAll('.table-scroll').forEach(updateSingleScrollBorder);
        }, 100);

        function wrapTable(table) {
                // Only wrap if not already wrapped
                if (table.closest('.table-viewport')) return;

                const viewport = document.createElement('div');
                viewport.classList.add('table-viewport');
                const scaler = document.createElement('div');
                scaler.classList.add('table-scaler');
                const scrollWrapper = document.createElement('div');
                scrollWrapper.classList.add('table-scroll');

                // Build DOM structure
                table.parentNode.insertBefore(viewport, table);
                scaler.appendChild(table);
                scrollWrapper.appendChild(scaler);
                viewport.appendChild(scrollWrapper);

                // --- The Core Update Logic ---
                // This now uses requestAnimationFrame to ensure we measure AFTER the browser has painted.
                function performUpdateCheck() {
                        requestAnimationFrame(() => {
                                if (!scrollWrapper) return;
                                const hasScrollbar = scrollWrapper.scrollHeight > scrollWrapper.clientHeight;
                                scrollWrapper.classList.toggle('has-scrollbar', hasScrollbar);
                                scrollWrapper.classList.toggle('scrollbar', hasScrollbar);
                        });
                }

                // --- Debounced version of the updater ---
                // This prevents the check from running hundreds of times if content is added in a loop.
                const debouncedUpdater = debounce(performUpdateCheck, 100); // A 100ms delay is reasonable.

                // --- Observer 1: For Container Size Changes ---
                // This handles window resizing or other external layout shifts.
                const resizeObserver = new ResizeObserver(debouncedUpdater);
                resizeObserver.observe(scrollWrapper);

                // --- Observer 2: For Content Changes ---
                // This is the key for your issue. It detects when new rows are added.
                const contentObserver = new MutationObserver(debouncedUpdater);
                contentObserver.observe(table, {
                        childList: true, // Watches for <tbody> being added/removed
                        subtree: true,   // Watches for <tr> being added/removed inside <tbody>
                });

                // --- Initial Check ---
                // Run the check once after the initial setup.
                performUpdateCheck();
        }

        // --- Observe DOM for dynamically added tables ---
        const mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;        

                        const newTables = node.matches('table:not(.no-scale)') 
                                ? [node] 
                                : node.querySelectorAll('table:not(.no-scale)');

                                newTables.forEach(wrapTable);
                        });
                }
                });
                // A single debounced update is still useful here in case many tables are added at once.
                debouncedUpdateAllBorders();
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        // --- Wrap all initial tables ---
        document.querySelectorAll('table:not(.no-scale)').forEach(wrapTable);
        // --- Recheck all tables on window resize ---
        window.addEventListener('resize', debouncedUpdateAllBorders);

});