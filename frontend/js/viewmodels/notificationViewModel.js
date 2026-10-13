// js/viewmodels/notificationViewModel.js

class NotificationViewModel {
  constructor() {
    this.state = new Observable({
      isLoading: false,
      notifications: [],
      unreadCount: 0,
      error: null
    });
  }

  async loadNotifications() {
    this.state.value = { ...this.state.value, isLoading: true, error: null };
    try {
      const res = await ApiService.getNotifications();
      if (res.ok) {
        const notifications = res.data.map(n => new Notification(n));
        this._update(notifications);
      } else {
        this.state.value = { ...this.state.value, isLoading: false, error: 'Erro ao carregar notificações.' };
      }
    } catch (err) {
      this.state.value = { ...this.state.value, isLoading: false, error: 'Falha de comunicação.' };
    }
  }

  // As ações atualizam a tela na hora (otimista) e confirmam no servidor;
  // se o servidor recusar, a lista é recarregada para voltar ao estado real.
  async markRead(id) {
    const target = this.state.value.notifications.find(n => n.id === id);
    if (!target || target.read) return;
    this._update(this.state.value.notifications.map(n =>
      n.id === id ? new Notification({ ...n, read: true }) : n
    ));
    this._confirm(await ApiService.markNotificationRead(id));
  }

  async markAllRead() {
    this._update(this.state.value.notifications.map(n => new Notification({ ...n, read: true })));
    this._confirm(await ApiService.markAllNotificationsRead());
  }

  async remove(id) {
    this._update(this.state.value.notifications.filter(n => n.id !== id));
    this._confirm(await ApiService.deleteNotification(id));
  }

  // Atualiza o estado e recalcula o total de não-lidas
  _update(notifications) {
    const unreadCount = notifications.filter(n => !n.read).length;
    this.state.value = { ...this.state.value, isLoading: false, notifications, unreadCount, error: null };
  }

  _confirm(res) {
    if (!res.ok) {
      this.state.value = { ...this.state.value, error: res.error };
      this.loadNotifications();
    }
  }
}

const notificationViewModel = new NotificationViewModel();
