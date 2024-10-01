class User {
    constructor(userData = {}) {
      // Desestruturação com valores padrão e prevenção de erro caso userData seja null ou undefined
      const {
        birth_date = null,
        creation_date = null,
        current_service_location = '',
        email = '',
        first_name = '',
        last_name = '',
        password = '',
        phone = '',
        slug = '',
        profile_picture_url = 'https://via.placeholder.com/150',
        user_type = null
      } = userData || {};
  
      // Se o birth_date ou creation_date forem fornecidos, converte para Date, caso contrário define como null
      this.birthDate = birth_date ? new Date(birth_date.seconds * 1000) : null;
      this.creationDate = creation_date ? new Date(creation_date.seconds * 1000) : null;
      this.currentServiceLocation = current_service_location;
      this.email = email;
      this.firstName = first_name;
      this.lastName = last_name;
      this.password = password;
      this.phone = phone;
      this.slug = slug;
      this.profilePictureUrl = profile_picture_url;
      this.userType = user_type;
    }
  
    returnSlug() {
      return this.slug;
    }
  }
  
  export default User;
  