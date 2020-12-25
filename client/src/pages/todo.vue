<template>
  <div class="container mybody">
    <div align="right">
      <h6>Welcome, {{ username }}</h6>
      <q-btn
        class="glossy logout"
        rounded
        color="red"
        label="Logout"
        @click="logout()"
      />
    </div>
    <div class="row">
      <div class="col-sm">
        <h4 class="wrdwrp">Add TODO</h4>
        <div class="q-gutter-y-md column mxwdt">
          <q-input
            rounded
            outlined
            v-model="newTodoName"
            @keydown.enter="addToDo()"
            label="Todo Name"
          >
            <template v-slot:prepend>
              <q-avatar>
                <img src="..\assets\todo-icon.png" />
              </q-avatar>
            </template>
          </q-input>
          <br />
          <q-input
            rounded
            outlined
            @keydown.enter="addToDo()"
            v-model="newTodoPriority"
            label="Todo Priority: 1 to 10"
          >
            <template v-slot:prepend>
              <q-avatar>
                <img src="..\assets\priority-icon.png" />
              </q-avatar>
            </template>
          </q-input>
          <br />
          <q-btn
            @click="addToDo()"
            @keydown.enter="addToDo()"
            class="glossy"
            rounded
            color="primary"
            label="Submit"
          />
        </div>
      </div>

      <div class="col-sm">
        <h4 class="wrdwrp">Uncompleted TODOs</h4>
        <div class="q-pa-md row items-start q-gutter-md mxwdt">
          <div v-for="todo in uncompletedTodos" :key="todo._id">
            <q-card
              class="bg-grey-10 text-white shadow-2 rounded-borders my-card"
            >
              <q-card-section>
                <div class="text-h6 wrdwrp">{{ todo.title }}</div>
                <br />
                <div class="text-subtitle2 wrdwrp">{{ todo.priority }}</div>
              </q-card-section>
              <q-separator dark />
              <q-card-actions align="right">
                <q-btn
                  @click="completeTodo(todo._id)"
                  flat
                  round
                  color="teal"
                  icon="done"
                />
                <q-btn@click="deleteTodo(todo._id)" flat round color="red"
                icon="delete" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <div class="col-sm">
        <h4 class="wrdwrp">Completed TODOs</h4>
        <div class="q-pa-md row items-start q-gutter-md mxwdt">
          <div v-for="todo in completedTodos" :key="todo._id">
            <q-card
              class="bg-grey-10 text-white shadow-2 rounded-borders my-card"
            >
              <q-card-section>
                <div class="text-h6 wrdwrp">{{ todo.title }}</div>
                <br />
                <div class="text-subtitle2 wrdwrp">{{ todo.priority }}</div>
              </q-card-section>
              <q-separator dark />
              <q-card-actions align="right">
                <q-btn
                  @click="undoTodo(todo._id)"
                  flat
                  round
                  color="primary"
                  icon="undo"
                />
                <q-btn
                  @click="deleteTodo(todo._id)"
                  flat
                  round
                  color="red"
                  icon="delete"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import jwtDecode from "jwt-decode";
export default {
  name: "App",
  data() {
    const token = localStorage.usertoken;
    const decoded = jwtDecode(token);
    console.log(decoded);
    console.log(Date.now());
    return {
      username: decoded.username,
      date: decoded.date,
      message: "",
      newTodoName: "",
      newTodoPriority: "",
      uncompletedTodos: [],
      completedTodos: []
    };
  },
  methods: {
    addToDo() {
      if (this.checklogin()) {
        axios
          .post("http://localhost:3000/todo/add", {
            todoName: this.newTodoName,
            todoPriority: this.newTodoPriority,
            username: this.username
          })
          .then(response => {
            //this.message = response.data;
            if (response.data[0] == 1) {
              this.$q.notify({
                message: response.data[1],
                type: "negative",
                timeout: 5000,
                progress: true,
                position: "bottom-right",
                html: true
              });
            } else {
              this.$q.notify({
                message: response.data[1],
                type: "positive",
                timeout: 5000,
                progress: true,
                position: "bottom-right",
                html: true
              });
            }
            this.newTodoName = "";
            this.newTodoPriority = "";
            this.refresh();
          });
      } else {
        this.logout();
      }
    },
    completeTodo(todoID) {
      axios
        .post("http://localhost:3000/todo/complete/" + todoID)
        .then(response => {
          if (response.data[0] == 1) {
            this.$q.notify({
              message: response.data[1],
              type: "negative",
              timeout: 5000,
              progress: true,
              position: "bottom-right",
              html: true
            });
          } else {
            this.$q.notify({
              message: response.data[1],
              type: "positive",
              timeout: 5000,
              progress: true,
              position: "bottom-right",
              html: true
            });
          }
          this.refresh();
        });
    },
    deleteTodo(todoID) {
      axios
        .delete("http://localhost:3000/todo/delete/" + todoID)
        .then(response => {
          if (response.data[0] == 1) {
            this.$q.notify({
              message: response.data[1],
              type: "negative",
              timeout: 5000,
              progress: true,
              position: "bottom-right",
              html: true
            });
          } else {
            this.$q.notify({
              message: response.data[1],
              type: "positive",
              timeout: 5000,
              progress: true,
              position: "bottom-right",
              html: true
            });
          }
          this.refresh();
        });
    },

    undoTodo(todoID) {
      axios.post("http://localhost:3000/todo/undo/" + todoID).then(response => {
        if (response.data[0] == 1) {
          this.$q.notify({
            message: response.data[1],
            type: "negative",
            timeout: 5000,
            progress: true,
            position: "bottom-right",
            html: true
          });
        } else {
          this.$q.notify({
            message: response.data[1],
            type: "positive",
            timeout: 5000,
            progress: true,
            position: "bottom-right",
            html: true
          });
        }
        this.refresh();
      });
    },
    refresh() {
      // fetch uncompleted task
      axios
        .post("http://localhost:3000/todo/uncompleted", {
          username: this.username
        })
        .then(response => (this.uncompletedTodos = response.data))
        .catch(error => console.log(error));
      // fetch completed task
      axios
        .post("http://localhost:3000/todo/completed", {
          username: this.username
        })
        .then(response => (this.completedTodos = response.data))
        .catch(error => console.log(error));
    },
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
    checklogin() {
      return (this.date + Date.now()) > Date.now();
    }
  },
  created() {
    this.refresh();
  }
};
</script>

<style>
.mxwdt {
  max-width: 80%;
}

.logout {
  max-width: 20%;
}

.wrdwrp {
  word-wrap: break-word;
}

.my-card {
  width: 100%;
  max-width: 350px;
}

.mybody {
  padding-left: 3%;
  padding-right: 3%;
}
</style>
