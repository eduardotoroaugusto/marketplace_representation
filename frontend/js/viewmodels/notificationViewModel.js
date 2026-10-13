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

  markRead(id) {
    const notifications = this.state.value.notifications.map(n =>
      n.id === id ? new Notification({ ...n, read: true }) : n
    );
    this._update(notifications);
  }

  markAllRead() {
    const notifications = this.state.value.notifications.map(n =>
      new Notification({ ...n, read: true })
    );
    this._update(notifications);
  }

  remove(id) {
    const notifications = this.state.value.notifications.filter(n => n.id !== id);
    this._update(notifications);
  }

  // Atualiza o estado, recalcula o total de não-lidas e persiste
  _update(notifications) {
    const unreadCount = notifications.filter(n => !n.read).length;
    this.state.value = { ...this.state.value, isLoading: false, notifications, unreadCount, error: null };
    ApiService.saveNotifications(notifications);
  }
}

const notificationViewModel = new NotificationViewModel();
