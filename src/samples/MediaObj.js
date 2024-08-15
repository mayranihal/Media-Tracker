class MediaObj {
  constructor(title, year, rating, icon, notes = null) {
    this.title = title;
    this.year = year;
    this.rating = rating;
    this.icon = icon;
    if (notes == null) {
      this.notes = "";
    } else {
      this.notes = notes;
    }
  }
}

export default MediaObj;
