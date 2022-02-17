<template>
  <div class="container">
    <h3>Изменить нарушение</h3>
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
import {app} from '../firebase';
import {getFirestore, doc, setDoc,  getDoc, deleteDoc} from "firebase/firestore";

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
    this.getMarker();
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
      await deleteDoc(doc(_db, 'tickets', this.$route.params.id));
      const docRef = doc(_db, "tickets", Date.now().toString());
      await setDoc(docRef, ticket);
      this.message =  '';
      this.source = '';
      this.video = '';
      this.image = null;
      alert('Жалоба добавлена');
    },
    async getMarker() {
      const id = this.$route.params.id;
      const _db = getFirestore(app);
      const ref = doc(_db, 'tickets', id);
      const snap = await getDoc(ref);
      const data = snap.data();
      this.content = data.content;
      this.lat = data.lat;
      this.lng = data.lng;
      this.count = data.count;
    }
  },
}
</script>

<style scoped>
.container {
  padding: 30px;
}
</style>
