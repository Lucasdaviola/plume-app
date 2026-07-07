// Données initiales
const INITIAL_DATA = {
    equipe: [
        {
            id: 1,
            nom: "Flore Seube",
            telephone: "+33 6 21 97 36 12",
            email: "flore.seube@gmail.com"
        },
        {
            id: 2,
            nom: "Mathilde Vialle",
            telephone: "+33 6 26 90 49 51",
            email: "mathildevialle@gmail.com"
        },
        {
            id: 3,
            nom: "Benjamin Garnier",
            telephone: "06 15 19 04 59",
            email: "monosaure@gmail.com"
        },
        {
            id: 4,
            nom: "Lucas Peres",
            telephone: "0616186613",
            email: "lucas.lirone@gmail.com"
        }
    ],
    programmes: [
        {
            id: 1,
            titre: "Crystal Teares",
            description: "Musique anglaise pour consort de violes",
            duree: 45
        },
        {
            id: 2,
            titre: "Consort Songs",
            description: "Musique pour voix et consort de violes",
            duree: 50
        },
        {
            id: 3,
            titre: "La Gamba",
            description: "Musique italienne pour violes de gambe",
            duree: 55
        }
    ],
    concerts: [
        {
            id: 1,
            programme: "Crystal Teares",
            lieu: "Les Méridiennes",
            date: "2026-07-03",
            responsable: "Flore Seube",
            statut: "Confirmé",
            public: 120,
            recette: 2400,
            notes: "Concert de présentation"
        }
    ],
    contacts: []
};

// ===== PAGE PROSPECTION =====
window.loadProspection = async function() {
    const db = window.database;
    const dbRef = window.ref;
    const getSnapshot = window.get;

    try {
        // Récupérer les contacts
        const snapshot = await getSnapshot(dbRef(db, 'contacts'));
        const contacts = snapshot.val() ? Object.values(snapshot.val()) : INITIAL_DATA.contacts;

        updateMetrics(contacts);

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>📊 Prospection Contacts</h2>
                <button class="btn" onclick="openAddContactForm()">➕ NOUVEAU CONTACT</button>
            </div>
        `;

        if (contacts.length === 0) {
            html += `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>Aucun contact pour le moment</h3>
                    <p>Commencez par ajouter un nouveau contact</p>
                </div>
            `;
        } else {
            html += `
                <table>
                    <thead>
                        <tr>
                            <th>Structure</th>
                            <th>Contact</th>
                            <th>Programme</th>
                            <th>Responsable</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            contacts.forEach(contact => {
                const statusClass = `status-${contact.statut?.toLowerCase().replace(/\s+/g, '')}`;
                html += `
                    <tr>
                        <td><strong>${contact.structure || 'N/A'}</strong></td>
                        <td>${contact.contact || 'N/A'}</td>
                        <td>${contact.programme || 'N/A'}</td>
                        <td>${contact.responsable || 'N/A'}</td>
                        <td><span class="status ${statusClass}">${contact.statut || 'N/A'}</span></td>
                        <td>
                            <button class="btn btn-secondary" onclick="editContact('${contact.id}')">✏️ Éditer</button>
                            <button class="btn btn-danger" onclick="deleteContact('${contact.id}')">🗑️ Supprimer</button>
                        </td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;
        }

        document.getElementById('content').innerHTML = html;
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('content').innerHTML = '<p style="color: red;">Erreur lors du chargement</p>';
    }
};

// ===== PAGE CONTACTS =====
window.loadContacts = async function() {
    const db = window.database;
    const dbRef = window.ref;
    const getSnapshot = window.get;

    try {
        const snapshot = await getSnapshot(dbRef(db, 'contacts'));
        const contacts = snapshot.val() ? Object.values(snapshot.val()) : INITIAL_DATA.contacts;

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>📇 Base de Données Contacts</h2>
                <button class="btn" onclick="openAddContactForm()">➕ AJOUTER</button>
            </div>
        `;

        if (contacts.length === 0) {
            html += `<div class="empty-state"><div class="empty-state-icon">📭</div><p>Aucun contact</p></div>`;
        } else {
            html += `
                <table>
                    <thead>
                        <tr>
                            <th>Structure</th>
                            <th>Directeur</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Thématiques</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            contacts.forEach(contact => {
                html += `
                    <tr>
                        <td>${contact.structure || ''}</td>
                        <td>${contact.directeur || ''}</td>
                        <td>${contact.email_directeur || ''}</td>
                        <td>${contact.contact || ''}</td>
                        <td>${contact.thematiques || ''}</td>
                        <td>
                            <button class="btn btn-secondary" onclick="editContact('${contact.id}')">✏️</button>
                            <button class="btn btn-danger" onclick="deleteContact('${contact.id}')">🗑️</button>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table>`;
        }

        document.getElementById('content').innerHTML = html;
    } catch (error) {
        console.error('Erreur:', error);
    }
};

// ===== PAGE ÉQUIPE =====
window.loadEquipe = async function() {
    const equipe = INITIAL_DATA.equipe;

    let html = `<h2>👥 Équipe Plume</h2>`;
    html += `
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
    `;

    equipe.forEach(member => {
        html += `
            <tr>
                <td><strong>${member.nom}</strong></td>
                <td><a href="tel:${member.telephone}">${member.telephone}</a></td>
                <td><a href="mailto:${member.email}">${member.email}</a></td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    document.getElementById('content').innerHTML = html;
};

// ===== PAGE PROGRAMMES =====
window.loadProgrammes = async function() {
    const programmes = INITIAL_DATA.programmes;

    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>🎵 Programmes Musicaux</h2>
        </div>
    `;

    html += `
        <table>
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Durée (min)</th>
                </tr>
            </thead>
            <tbody>
    `;

    programmes.forEach(prog => {
        html += `
            <tr>
                <td><strong>${prog.titre}</strong></td>
                <td>${prog.description}</td>
                <td>${prog.duree}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    document.getElementById('content').innerHTML = html;
};

// ===== PAGE CONCERTS =====
window.loadConcerts = async function() {
    const db = window.database;
    const dbRef = window.ref;
    const getSnapshot = window.get;

    try {
        const snapshot = await getSnapshot(dbRef(db, 'concerts'));
        const concerts = snapshot.val() ? Object.values(snapshot.val()) : INITIAL_DATA.concerts;

        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>🎼 Concerts</h2>
                <button class="btn" onclick="openAddConcertForm()">➕ AJOUTER</button>
            </div>
        `;

        if (concerts.length === 0) {
            html += `<div class="empty-state"><div class="empty-state-icon">🎼</div><p>Aucun concert</p></div>`;
        } else {
            html += `
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Lieu</th>
                            <th>Programme</th>
                            <th>Responsable</th>
                            <th>Statut</th>
                            <th>Public</th>
                            <th>Recette (€)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            concerts.forEach(concert => {
                const statusClass = `status-${concert.statut?.toLowerCase().replace(/\s+/g, '')}`;
                const dateObj = new Date(concert.date);
                const dateFormatted = dateObj.toLocaleDateString('fr-FR');

                html += `
                    <tr>
                        <td>${dateFormatted}</td>
                        <td>${concert.lieu}</td>
                        <td>${concert.programme}</td>
                        <td>${concert.responsable}</td>
                        <td><span class="status ${statusClass}">${concert.statut}</span></td>
                        <td>${concert.public || 0}</td>
                        <td>${concert.recette || 0}€</td>
                        <td>
                            <button class="btn btn-secondary" onclick="editConcert('${concert.id}')">✏️</button>
                            <button class="btn btn-danger" onclick="deleteConcert('${concert.id}')">🗑️</button>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table>`;
        }

        document.getElementById('content').innerHTML = html;
    } catch (error) {
        console.error('Erreur:', error);
    }
};

// ===== FONCTIONS UTILITAIRES =====
function updateMetrics(contacts) {
    const total = contacts.length;
    const toContact = contacts.filter(c => c.statut === 'A contacter').length;
    const confirmed = contacts.filter(c => c.statut === 'Confirmé').length;
    const inProgress = contacts.filter(c => ['En cours', 'Relancé'].includes(c.statut)).length;

    document.getElementById('total-contacts').textContent = total;
    document.getElementById('to-contact').textContent = toContact;
    document.getElementById('confirmed').textContent = confirmed;
    document.getElementById('in-progress').textContent = inProgress;
}

window.openAddContactForm = function() {
    document.getElementById('modalTitle').textContent = 'Ajouter un nouveau contact';
    const formFields = document.getElementById('formFields');
    formFields.innerHTML = `
        <div class="form-group">
            <label>Structure / Festival</label>
            <input type="text" id="structure" required>
        </div>
        <div class="form-group">
            <label>Directeur</label>
            <input type="text" id="directeur">
        </div>
        <div class="form-group">
            <label>Email Directeur</label>
            <input type="email" id="email_directeur">
        </div>
        <div class="form-group">
            <label>Téléphone</label>
            <input type="tel" id="telephone">
        </div>
        <div class="form-group">
            <label>Contact Direct</label>
            <input type="text" id="contact">
        </div>
        <div class="form-group">
            <label>Email Contact</label>
            <input type="email" id="email_contact">
        </div>
        <div class="form-group">
            <label>Thématiques</label>
            <input type="text" id="thematiques">
        </div>
        <div class="form-group">
            <label>Programme</label>
            <select id="programme">
                <option value="">-- Choisir --</option>
                <option value="Crystal Teares">Crystal Teares</option>
                <option value="Consort Songs">Consort Songs</option>
                <option value="La Gamba">La Gamba</option>
            </select>
        </div>
        <div class="form-group">
            <label>Responsable</label>
            <select id="responsable">
                <option value="">-- Choisir --</option>
                <option value="Flore Seube">Flore Seube</option>
                <option value="Mathilde Vialle">Mathilde Vialle</option>
                <option value="Benjamin Garnier">Benjamin Garnier</option>
                <option value="Lucas Peres">Lucas Peres</option>
            </select>
        </div>
        <div class="form-group">
            <label>Statut</label>
            <select id="statut">
                <option value="A contacter">A contacter</option>
                <option value="En cours">En cours</option>
                <option value="Relancé">Relancé</option>
                <option value="En attente">En attente</option>
                <option value="Confirmé">Confirmé</option>
                <option value="Refusé">Refusé</option>
            </select>
        </div>
        <div class="form-group">
            <label>Notes</label>
            <textarea id="notes"></textarea>
        </div>
    `;
    document.getElementById('dataForm').onsubmit = saveContact;
    document.getElementById('formModal').classList.add('active');
};

window.openAddConcertForm = function() {
    document.getElementById('modalTitle').textContent = 'Ajouter un concert';
    const formFields = document.getElementById('formFields');
    formFields.innerHTML = `
        <div class="form-group">
            <label>Date</label>
            <input type="date" id="date" required>
        </div>
        <div class="form-group">
            <label>Lieu</label>
            <input type="text" id="lieu" required>
        </div>
        <div class="form-group">
            <label>Programme</label>
            <select id="programme">
                <option value="">-- Choisir --</option>
                <option value="Crystal Teares">Crystal Teares</option>
                <option value="Consort Songs">Consort Songs</option>
                <option value="La Gamba">La Gamba</option>
            </select>
        </div>
        <div class="form-group">
            <label>Responsable</label>
            <select id="responsable">
                <option value="">-- Choisir --</option>
                <option value="Flore Seube">Flore Seube</option>
                <option value="Mathilde Vialle">Mathilde Vialle</option>
                <option value="Benjamin Garnier">Benjamin Garnier</option>
                <option value="Lucas Peres">Lucas Peres</option>
            </select>
        </div>
        <div class="form-group">
            <label>Statut</label>
            <select id="statut">
                <option value="Prospection">Prospection</option>
                <option value="Négociation">Négociation</option>
                <option value="Confirmé">Confirmé</option>
                <option value="Réalisé">Réalisé</option>
                <option value="Annulé">Annulé</option>
            </select>
        </div>
        <div class="form-group">
            <label>Public estimé</label>
            <input type="number" id="public" min="0">
        </div>
        <div class="form-group">
            <label>Recette (€)</label>
            <input type="number" id="recette" min="0">
        </div>
        <div class="form-group">
            <label>Notes</label>
            <textarea id="notes"></textarea>
        </div>
    `;
    document.getElementById('dataForm').onsubmit = saveConcert;
    document.getElementById('formModal').classList.add('active');
};

async function saveContact(e) {
    e.preventDefault();
    const db = window.database;
    const dbRef = window.ref;
    const setPush = window.push;

    const contact = {
        structure: document.getElementById('structure').value,
        directeur: document.getElementById('directeur').value,
        email_directeur: document.getElementById('email_directeur').value,
        telephone: document.getElementById('telephone').value,
        contact: document.getElementById('contact').value,
        email_contact: document.getElementById('email_contact').value,
        thematiques: document.getElementById('thematiques').value,
        programme: document.getElementById('programme').value,
        responsable: document.getElementById('responsable').value,
        statut: document.getElementById('statut').value,
        notes: document.getElementById('notes').value,
        createdAt: new Date().toISOString()
    };

    try {
        const newRef = setPush(dbRef(db, 'contacts'));
        await setPush(newRef, contact);
        window.closeModal();
        window.loadPage(window.currentPage);
    } catch (error) {
        alert('Erreur lors de la sauvegarde: ' + error.message);
    }
}

async function saveConcert(e) {
    e.preventDefault();
    const db = window.database;
    const dbRef = window.ref;
    const setPush = window.push;

    const concert = {
        date: document.getElementById('date').value,
        lieu: document.getElementById('lieu').value,
        programme: document.getElementById('programme').value,
        responsable: document.getElementById('responsable').value,
        statut: document.getElementById('statut').value,
        public: parseInt(document.getElementById('public').value) || 0,
        recette: parseInt(document.getElementById('recette').value) || 0,
        notes: document.getElementById('notes').value,
        createdAt: new Date().toISOString()
    };

    try {
        const newRef = setPush(dbRef(db, 'concerts'));
        await setPush(newRef, concert);
        window.closeModal();
        window.loadPage(window.currentPage);
    } catch (error) {
        alert('Erreur lors de la sauvegarde: ' + error.message);
    }
}

window.editContact = function(id) {
    alert('Fonctionnalité édition à implémenter');
};

window.deleteContact = function(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
        const db = window.database;
        const dbRef = window.ref;
        const removeFunc = window.remove;
        removeFunc(dbRef(db, 'contacts/' + id)).then(() => {
            window.loadPage(window.currentPage);
        });
    }
};

window.editConcert = function(id) {
    alert('Fonctionnalité édition à implémenter');
};

window.deleteConcert = function(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce concert ?')) {
        const db = window.database;
        const dbRef = window.ref;
        const removeFunc = window.remove;
        removeFunc(dbRef(db, 'concerts/' + id)).then(() => {
            window.loadPage(window.currentPage);
        });
    }
};
