<template>
  <div class="container">
    <h3>Создать нарушение</h3>
    <quill-editor
        v-model="content"
    />
    <v-text-field
        type="number"
        v-model.number="count"
        label="Количество нарушений"
    />
    <v-text-field
        label="Широта"
        v-model="lat"
    />
    <v-text-field
        label="Долгота"
        v-model="lng"
    />
    <div>
      <v-btn class="mt-5" color="success" @click="onSubmit">
        Сохранить <v-icon>mdi-checkmark</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import {db, firebaseStorage, app} from '../firebase';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default {
  data: () => ({
    message: '',
    source: '',
    video: '',
    image: null,
    lat: null,
    lng: null,
    content: '',
    count: 0,
  }),
  mounted() {
    this.lat =  localStorage.getItem('lat') || null;
    this.lng =  localStorage.getItem('lng') || null;
  },
  methods: {
    async onSubmit() {
      const ticket = {
        content: this.content,
        lat: this.lat,
        lng: this.lng,
        created_at: Date.now().toString(),
        count: this.count,
      };

      const _db = getFirestore(app);
      const docRef = doc(_db, "tickets", Date.now().toString());
      await setDoc(docRef, ticket);
      this.message =  '';
      this.source = '';
      this.video = '';
      this.image = null;
      alert('Жалоба добавлена');
    }
  },
}
</script>

<style scoped>
.container {
  padding: 30px;
}
</style>
