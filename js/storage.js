/**
 * Systicket - Stockage persistant via localStorage
 * Remplace app-data.js - toutes les données persistent entre rechargements
 */
(function() {
    'use strict';

    var PREFIX = 'systicket_';

    var store = (typeof localStorage !== 'undefined') ? localStorage : (typeof sessionStorage !== 'undefined' ? sessionStorage : null);
    if (!store) {
        var memStore = {};
        store = {
            getItem: function(k) { return memStore[k] || null; },
            setItem: function(k, v) { memStore[k] = String(v); },
            removeItem: function(k) { delete memStore[k]; }
        };
    }

    function get(key) {
        try {
            return JSON.parse(store.getItem(PREFIX + key) || 'null');
        } catch (e) {
            return null;
        }
    }

    function set(key, val) {
        try {
            store.setItem(PREFIX + key, JSON.stringify(val));
        } catch (e) {
            console.warn('storage.set failed:', e);
        }
    }

    function initSampleData() {
        if (get('clients') !== null) return;

        set('clients', [
            { _id: 1, name: 'Acme Corp', contact: 'Jean Martin', email: 'contact@acme.fr', phone: '01 23 45 67 89', address: 'Paris', status: 'active' },
            { _id: 2, name: 'Tech Solutions', contact: 'Marie Durand', email: 'info@techsol.fr', phone: '', address: 'Lyon', status: 'inactive' },
            { _id: 3, name: 'Design Studio', contact: 'Pierre Leroy', email: 'contact@design.fr', phone: '03 12 34 56 78', address: 'Marseille', status: 'active' }
        ]);

        set('projets', [
            { _id: 101, name: 'Site e-commerce', client: '1', status: 'active', start_date: '2025-01-15', end_date: '2025-06-30' },
            { _id: 102, name: 'Application mobile', client: '2', status: 'paused', start_date: '2025-02-01', end_date: '2025-08-31' },
            { _id: 103, name: 'Refonte site vitrine', client: '1', status: 'completed', start_date: '2024-10-01', end_date: '2025-01-15' }
        ]);

        set('tickets', [
            { _id: 1001, title: 'Maquettes homepage', project: '101', status: 'done', priority: 'high', type: 'included', estimated_hours: 8 },
            { _id: 1002, title: 'Intégration panier', project: '101', status: 'in-progress', priority: 'high', type: 'billable', estimated_hours: 24 },
            { _id: 1003, title: 'API authentification', project: '102', status: 'to-validate', priority: 'critical', type: 'billable', estimated_hours: 16 }
        ]);

        set('contrats', [
            { _id: 201, project: '101', client: '1', hours: 100, rate: 80, start: '2025-01-15', end: '2025-06-30' },
            { _id: 202, project: '102', client: '2', hours: 80, rate: 90, start: '2025-02-01', end: '2025-08-31' }
        ]);

        set('temps', [
            { _id: 301, date: '2025-02-01', project: '101', ticket: '1001', hours: 8, description: 'Maquettes', user: '1' },
            { _id: 302, date: '2025-02-05', project: '101', ticket: '1002', hours: 4, description: 'Intégration', user: '2' }
        ]);

        set('validations', []);
        set('utilisateurs', [
            { _id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@exemple.fr', telephone: '01 23 45 67 89', role: 'admin', status: 'active', last_login: '2026-02-08' },
            { _id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie@exemple.fr', telephone: '', role: 'collaborateur', status: 'active', last_login: '2026-02-07' },
            { _id: 3, nom: 'Client', prenom: 'Pierre', email: 'pierre@client.fr', telephone: '', role: 'client', status: 'inactive', last_login: null }
        ]);
        set('profil', null);
    }

    window.Storage = {
        get: get,
        set: set,

        add: function(collection, item) {
            var list = get(collection);
            if (!Array.isArray(list)) list = [];
            item._id = item._id || Date.now();
            list.push(item);
            set(collection, list);
            return item;
        },

        update: function(collection, id, updates) {
            var list = get(collection);
            if (!Array.isArray(list)) return null;
            var index = -1;
            for (var i = 0; i < list.length; i++) {
                if (String(list[i]._id) === String(id)) { index = i; break; }
            }
            if (index === -1) return null;
            var item = list[index];
            for (var k in updates) {
                if (Object.prototype.hasOwnProperty.call(updates, k)) item[k] = updates[k];
            }
            item._id = list[index]._id;
            list[index] = item;
            set(collection, list);
            return item;
        },

        remove: function(collection, id) {
            var list = get(collection);
            if (!Array.isArray(list)) return;
            var filtered = list.filter(function(i) { return String(i._id) !== String(id); });
            set(collection, filtered);
        },

        getSession: function(key) {
            try {
                var s = (typeof sessionStorage !== 'undefined') ? sessionStorage : store;
                return JSON.parse(s.getItem(PREFIX + key) || 'null');
            } catch (e) {
                return null;
            }
        },

        setSession: function(key, val) {
            try {
                var s = (typeof sessionStorage !== 'undefined') ? sessionStorage : store;
                if (val === null || val === undefined) {
                    s.removeItem(PREFIX + key);
                } else {
                    s.setItem(PREFIX + key, JSON.stringify(val));
                }
            } catch (e) {}
        },

        initSampleData: initSampleData
    };

    initSampleData();

    /* Alias pour compatibilité avec code existant (AppData) */
    window.AppData = {
        get: get,
        set: set,
        add: function(c, item) { return Storage.add(c, item); },
        update: function(c, id, updates) { return Storage.update(c, id, updates); },
        getSession: Storage.getSession.bind(Storage),
        setSession: Storage.setSession.bind(Storage)
    };
})();
