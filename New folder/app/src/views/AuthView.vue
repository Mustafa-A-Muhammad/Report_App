<script setup lang="ts">
import Login from '../components/login.vue';
import Report from '../components/Report.vue';
import Print from 'vue-to-print'
import { ref } from 'vue';
const printRef = ref(null)

</script>


<<template>
  <v-container class="d-flex align-center justify-center"
    style="height: 100vh;"
    fluid>
    <v-row
      align="center"
      justify="center"
      class="ma-0 pa-0"
    >
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="8" class="pa-6">
          <Login></Login>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <Print :content="printRef">
    <Report ref = 'printRef'></Report>
  </Print>
</template>

