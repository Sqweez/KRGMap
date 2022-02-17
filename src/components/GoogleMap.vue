<template>
  <div>
    <div ref='googleMap' class='google-map' v-show="!showPanorama"></div>
    <div id="pano" v-show="showPanorama">

    </div>
    <v-dialog width="700" v-model="problemModal">
      <v-card>
        <v-card-title>
          Информация
        </v-card-title>
        <v-card-text>
          <div v-html="currentMarker.content"></div>
          <b></b>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {app, db} from "../firebase";
import {collection, query, where, getDocs, getFirestore} from "firebase/firestore";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export default {
  data: () => ({
    bounds: new google.maps.LatLngBounds(), // Авто масштабирование карты
    mapOptions: {
      center: {lat: 42.8700000, lng: 74.5900000},
      zoomControl: false,
      zoom: 7,
      gestureHandling: 'greedy',
      mapId: '48fe2b8e03333248',
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      scrollwheel: false,
    },
    modal: false,
    lat: 42.87,
    lng: 74.59,
    map: null,
    markersList: [],
    markers: [],
    problemModal: false,
    currentMarker: {},
    panorama: null,
    panoramaVisible: false,
    panoramaCoords: {
      lat: 42.8700000, lng: 74.5900000
    },
    showPanorama: false,
    scrollwheel: false,
  }),
  methods: {
    createAProblem() {
      this.lat = this.panoramaCoords.lat || 42.8700000;
      this.lng = this.panoramaCoords.lng || 74.5900000;
    },
    handleMarkerClick(e, marker) {
      this.currentMarker = marker;
      this.problemModal = true;
    },
    async initMap(coords) {
      const options = {...this.mapOptions};
      let marker = null;

      if (coords) {
        this.mapOptions.center = {...coords};
      }

      this.map = await new google.maps.Map(this.$refs.googleMap, {
        ...this.mapOptions
      })

      this.panorama = await this.map.getStreetView();

      if (coords) {
        options.center.lat = coords.lat;
        options.center.lng = coords.lng;
        marker = new google.maps.Marker({
          position: {...coords},
          title: "Моя позиция",
          map: this.map,
        });
      }


      google.maps.event.addListener(this.map, 'click', e => {
        this.handleClick(e)
      })

      await this.getMarkers();
    },
    async handleClick(e) {
      const latLng = e.latLng;
      this.lat = latLng.lat();
      this.lng = latLng.lng();
    },
    onSubmit() {
      this.modal = false;
    },
    async getCurrentPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.getLocation)
      }
    },
    getLocation(pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      this.map = null;
      this.initMap({lat, lng});
    },
    async getMarkers() {
      const _db = getFirestore(app);
      const q = query(collection(_db, 'tickets'));
      const snapshot = await getDocs(q);
      snapshot.forEach(data => {
        this.markers.push({
          ...data.data(),
          id: data.id,
          position: {
            lat: parseFloat(data.data().lat),
            lng: parseFloat(data.data().lng)
          }
        })
      })
    }
  },
  async mounted() {
    await this.initMap();
  },
  computed: {
    isAuth() {
      return this.$store.getters.IS_AUTH;
    },
    isPanoVisible() {
      return this.panorama?.getVisible();
    },
    toolbar() {
      return this.$store.getters.TOOLBAR_VISIBLE;
    },
    panoramaString() {
      return this.panorama?.getPano();
    }
  },
  props: {},
  watch: {
    markers(val) {
      val.forEach((marker, index) => {
        this.markersList[index] = new google.maps.Marker({
          position: marker.position,
          map: this.map,
          title: "Нарушение на избирательном участке",
          id: marker.id,
          label: {
            text: `${marker.count}`,
            fontWeight: 'bold',
            color: '#fff'
          }
        });

        google.maps.event.addListener(this.markersList[index], 'click', e => {
          this.handleMarkerClick(e, marker);
        });
      })
    },
    async isPanoVisible(val) {
      this.panorama = await this.map.getStreetView();
      if (val && this.panorama) {
        const lat = this.panorama.position?.lat();
        const lng = this.panorama.position?.lng();
        this.panoramaCoords = {
          lat, lng
        };
      }
    }
  }
}
</script>

<style scoped lang="scss">
.google-map {
  width: 100%;
  height: 100vh;
}

#pano {
  width: 100%;
  height: 100%;
}

.gmnoprint {
  top: 0 !important;
}

#modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

</style>
