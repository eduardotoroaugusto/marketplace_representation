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

  // Ícone equivalente do layout mobile para cada tipo de notificação
  mobileIcon(icon) {
    return { 'package': 'notif-bag', 'tag': 'notif-info', 'alert-triangle': 'notif-bell' }[icon] || 'notif-bell';
  }

  maskStyle(name) {
    const url = `url(assets/icons/${name}.svg)`;
    return `-webkit-mask-image: ${url}; mask-image: ${url}`;
  }

  createRow(n) {
    const row = document.createElement('div');
    row.className = `notif-row ${n.read ? 'read' : 'unread'}`;
    row.dataset.id = n.id;

    row.innerHTML = `
      <div class="notif-icon">
        <img src="assets/icons/${n.icon}.svg" alt="" class="icon-16 only-desktop">
        <span class="mask-icon icon-18 only-mobile" style="${this.maskStyle(this.mobileIcon(n.icon))}"></span>
      </div>
      <div class="notif-text">
        <p class="notif-title">${n.title}</p>
        <p class="notif-time">${n.time}</p>
      </div>
      <div class="notif-actions">
        ${n.read ? '' : '<span class="unread-dot" aria-label="Não lida"></span>'}
        <button type="button" class="notif-delete" aria-label="Remover notificação">
          <img src="assets/icons/trash.svg" alt="" class="icon-14 only-desktop">
          <span class="mask-icon icon-14 only-mobile" style="-webkit-mask-image: url(assets/icons/x-circle.svg); mask-image: url(assets/icons/x-circle.svg)"></span>
        </button>
      </div>
    `;

    return row;
  }
}
