<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#8274C5, #5A4A9F);"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;height:485px;">
          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-md">TODO Login</h4>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-pt-xl">
              <q-input
                square
                 @keydown.enter="login()"
                v-model="username"
                type="username"
                label="Username"
              >
                <template v-slot:prepend>
                  <q-icon name="account_circle" />
                </template>
              </q-input>
              <q-input
                square
                @keydown.enter="login()"
                v-model="password"
                :type="isPwd ? 'password' : 'text'"
                label="Password"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg">
            <q-btn
              @click="login()"
              @keydown.enter="login()"
              unelevated
              size="lg"
              color="purple-4"
              class="full-width text-white"
              label="Sign In"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isPwd: true,
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      axios
        .post("http://localhost:3000/user/login", {
          username: this.username,
          password: this.password
        })
        .then(res => {
          if (res.data[0] == 1) {
            this.$q.notify({
              message: res.data[1],
              type: "negative",
              timeout: 5000,
              progress: true,
              position: "bottom-right",
              html: true
            });
          } else {
            localStorage.setItem("usertoken", res.data);
            this.username = "";
            this.password = "";
            this.$router.push("/");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style></style>
