(function(){
    'use strict';

    var _exportBound = new WeakSet();

    function downloadBlob(filename, blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function(){ URL.revokeObjectURL(url); }, 5000);
    }

    function getTableFromTbody(tbody) {
        var el = tbody;
        while (el && el.nodeName !== 'TABLE') el = el.parentElement;
        return el;
    }

    function tableToCsv(table) {
        var rows = [];
        var thead = table.querySelectorAll('thead tr');
        thead.forEach(function(tr){
            var cols = [];
            tr.querySelectorAll('th').forEach(function(th){ cols.push('"' + (th.textContent || '').trim().replace(/"/g,'""') + '"'); });
            if (cols.length) rows.push(cols.join(','));
        });
        var tbody = table.querySelectorAll('tbody tr');
        tbody.forEach(function(tr){
            if (tr.classList.contains('table-empty') || tr.classList.contains('table-empty-row')) return;
            var cols = [];
            tr.querySelectorAll('td').forEach(function(td){ cols.push('"' + (td.textContent || '').trim().replace(/"/g,'""') + '"'); });
            rows.push(cols.join(','));
        });
        return rows.join('\r\n');
    }

    function getExportTableForTarget(targetId) {
        var table = null;
        if (targetId) {
            var sec = document.getElementById(targetId);
            if (sec) {
                var tag = (sec.tagName || '').toUpperCase();
                if (tag === 'TABLE') table = sec;
                else if (tag === 'TBODY') table = sec.closest('table');
                else table = sec.querySelector('table') || (sec.querySelector('tbody') ? sec.querySelector('tbody').closest('table') : null);
            }
        }
        if (!table) {
            var tbody = document.getElementById('report-detail-tbody');
            if (tbody) table = getTableFromTbody(tbody);
        }
        if (!table) table = document.querySelector('.reports-section table');
        return table;
    }

    function exportReportCsv(targetId) {
        var table = getExportTableForTarget(targetId);
        if (!table) { alert('Aucune table disponible pour l\'export.'); return; }
        var csv = tableToCsv(table);
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var name = (targetId || 'rapport-detail') + '.csv';
        downloadBlob(name, blob);
    }

    function exportReportExcel(targetId) {
        var table = getExportTableForTarget(targetId);
        if (!table) { alert('Aucune table disponible pour l\'export.'); return; }
        var csv = tableToCsv(table);
        var blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        var name = (targetId || 'rapport-detail') + '.xls';
        downloadBlob(name, blob);
    }

    function exportReportPdf(targetId) {
        var header = document.querySelector('.page-header');
        var filters = document.querySelector('.reports-filters');
        var sections = [];
        if (targetId) {
            var sec = document.getElementById(targetId);
            if (sec) sections.push(sec);
        } else {
            sections = Array.prototype.slice.call(document.querySelectorAll('.reports-section, #report-detail'));
        }
        var doc = window.open('', '_blank');
        if (!doc) { alert('Impossible d\'ouvrir une nouvelle fenêtre. Veuillez autoriser les popups.'); return; }
        var cssHref = '';
        try { cssHref = document.querySelector('link[rel="stylesheet"]').href; } catch(e) { cssHref = ''; }
        var html = '<!doctype html><html><head><meta charset="utf-8"><title>Rapport</title>' + (cssHref ? '<link rel="stylesheet" href="'+cssHref+'">' : '') + '<style>body{padding:20px} .page-header-right{display:none}</style></head><body>';
        if (header) html += header.outerHTML;
        if (filters) html += filters.outerHTML;
        sections.forEach(function(s){ html += s.outerHTML; });
        html += '</body></html>';
        doc.document.open();
        doc.document.write(html);
        doc.document.close();
        setTimeout(function(){ doc.print(); }, 600);
    }

    function createMenu(button, items) {
        // remove existing
        var existing = document.getElementById('export-menu');
        if (existing) existing.remove();
        var rect = button.getBoundingClientRect();
        var menu = document.createElement('div');
        menu.id = 'export-menu';
        menu.style.position = 'absolute';
        menu.style.zIndex = 9999;
        menu.style.left = (rect.left + window.scrollX) + 'px';
        menu.style.top = (rect.bottom + window.scrollY + 6) + 'px';
        menu.style.background = '#fff';
        menu.style.border = '1px solid #ddd';
        menu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        menu.style.padding = '8px';
        items.forEach(function(it){
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn btn-text btn-small';
            b.style.display = 'block';
            b.style.width = '100%';
            b.style.textAlign = 'left';
            b.style.padding = '6px 10px';
            b.textContent = it.label;
            b.addEventListener('click', function(e){
                it.action();
                menu.remove();
            });
            menu.appendChild(b);
        });
        document.body.appendChild(menu);
        // close on outside click
        setTimeout(function(){
            function onDoc(e){ if (!menu.contains(e.target) && e.target !== button) { menu.remove(); document.removeEventListener('click', onDoc); } }
            document.addEventListener('click', onDoc);
        }, 10);
    }

    function init() {
        var mainBtn = document.getElementById('export-btn');
        if (mainBtn && !_exportBound.has(mainBtn)) {
            _exportBound.add(mainBtn);
            mainBtn.addEventListener('click', function() {
                createMenu(mainBtn, [
                    { label: 'Exporter en PDF', action: function(){ exportReportPdf(); } },
                    { label: 'Exporter Excel', action: function(){ exportReportExcel(); } },
                    { label: 'Exporter CSV', action: function(){ exportReportCsv(); } }
                ]);
            });
        }

        // Section export buttons (on all pages)
        document.querySelectorAll('.section-export-btn').forEach(function(btn){
            if (_exportBound.has(btn)) return;
            _exportBound.add(btn);
            btn.addEventListener('click', function(){
                var target = btn.getAttribute('data-target');
                createMenu(btn, [
                    { label: 'Exporter en PDF', action: function(){ exportReportPdf(target); } },
                    { label: 'Exporter Excel', action: function(){ exportReportExcel(target); } },
                    { label: 'Exporter CSV', action: function(){ exportReportCsv(target); } }
                ]);
            });
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
    // Re-init after SPA navigation to bind new export buttons
    document.addEventListener('systicket:contentLoaded', init);
})();
