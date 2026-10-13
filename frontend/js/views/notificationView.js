// js/views/notificationView.js

class NotificationView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.listEl = document.getElementById('notif-list');
    this.badgeEl = document.getElementById('notif-badge');
    this.markAllEl = document.getElementById('mark-all-read');
  }

  init() {
    this.viewModel.state.subscribe(state => this.render(state));
  }

  render(state) {
    this.renderBadge(state);
    this.renderList(state);
  }

  renderBadge(state) {
    if (!this.badgeEl) return;
    if (state.unreadCount > 0) {
      this.badgeEl.textContent = `${state.unreadCount} nova${state.unreadCount > 1 ? 's' : ''}`;
      this.badgeEl.classList.remove('hidden');
    } else {
      this.badgeEl.classList.add('hidden');
    }
    // "Marcar todas como lidas" só faz sentido se houver não-lidas
    if (this.markAllEl) this.markAllEl.classList.toggle('hidden', state.unreadCount === 0);
  }

  renderList(state) {
    if (state.isLoading) {
      this.listEl.innerHTML = '<p class="notif-empty">Carregando...</p>';
      return;
    }

    if (state.notifications.length === 0) {
      this.listEl.innerHTML = '<p class="notif-empty">Você não tem notificações.</p>';
      return;
    }

    this.listEl.innerHTML = '';
    state.notifications.forEach(n => this.listEl.appendChild(this.createRow(n)));
  }

  createRow(n) {
    const row = document.createElement('div');
    row.className = `notif-row ${n.read ? 'read' : 'unread'}`;
    row.dataset.id = n.id;

    row.innerHTML = `
      <div class="notif-icon">
        <img src="assets/icons/${n.icon}.svg" alt="" class="icon-16">
      </div>
      <div class="notif-text">
        <p class="notif-title">${n.title}</p>
        <p class="notif-time">${n.time}</p>
      </div>
      <div class="notif-actions">
        ${n.read ? '' : '<span class="unread-dot" aria-label="Não lida"></span>'}
        <button type="button" class="notif-delete" aria-label="Remover notificação">
          <img src="assets/icons/trash.svg" alt="" class="icon-14">
        </button>
      </div>
    `;

    return row;
  }
}
