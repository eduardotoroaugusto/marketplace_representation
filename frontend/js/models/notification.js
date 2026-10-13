// js/models/notification.js
class Notification {
  constructor({ id, icon, title, time, read }) {
    this.id = id;
    this.icon = icon;     // 'package' | 'alert-triangle' | 'tag'
    this.title = title;
    this.time = time;
    this.read = read;
  }
}
