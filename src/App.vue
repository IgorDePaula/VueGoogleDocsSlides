<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <button id="authorize_button" v-if="auth" @click="handleAuthClick">Authorize</button>
        <button id="signout_button" v-if="!auth" @click="handleSignoutClick">Sign Out</button>
        <br>
        <br>
        <ul>
            <li v-for="item in docs" @click="getThumbnail(item.id)" :key="item.id">{{item.name}}</li>
        </ul>
        <ul>
            <li v-for="item in thumbnails" :key="item"><img width="300" :src="item" alt=""></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'app',
        components: {},
        data() {
            return {
                auth: true,
                apiKey: 'AIzaSyCTrU266mWLQjD9D4NyGUQl9CY3Tm-idgA',
                clientId: '284342642848-9iq27f5v971epnr6qiuvktoh2tduqfjc.apps.googleusercontent.com',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest', 'https://slides.googleapis.com/$discovery/rest?version=v1'],
                scope: 'https://www.googleapis.com/auth/presentations',
                docs: [],
                thumbnails: []
            }
        },
        mounted() {
            const script = document.createElement('script')
            const head = document.querySelector('head')
            script.src = 'https://apis.google.com/js/api.js'
            script.onload = () => {
                console.log('carregado')
                this.handleClientLoad()
            }
            head.appendChild(script)
        },
        methods: {
            initClient() {
                console.log('iniciando')
                gapi.client.init({
                    apiKey: this.apiKey,
                    clientId: this.clientId,
                    discoveryDocs: this.discoveryDocs,
                    scope: this.scope
                }).then(() => {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

                    // Handle the initial sign-in state.
                    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

                })
                    .catch(console.error);
            },
            updateSigninStatus(isSignedIn) {
                if (isSignedIn) {
                    this.auth = false
                    this.printDocTitle()
                } else {
                    this.auth = true
                }
            },
            handleAuthClick(event) {
                gapi.auth2.getAuthInstance().signIn();
            },
            handleSignoutClick(event) {
                gapi.auth2.getAuthInstance().signOut();
                this.docs = []
            },
            handleClientLoad() {
                gapi.load('client:auth2', this.initClient);
            }, printDocTitle() {
                gapi.client.drive.files.list({

                    'fields': "nextPageToken, files(id, name,  mimeType)"
                }).then(response => {
                    this.docs = response.result.files.filter(item => item.mimeType == 'application/vnd.google-apps.presentation');
                });

            },
            getThumbnail(slideId) {
                this.thumbnails = []
                gapi.client.slides.presentations.get({
                    presentationId: slideId
                }).then(response => {
                    //console.log('response 1', response.result.slides)
                    Promise.all(
                        response.result.slides.map(async (slide) => {
                            const teste = await gapi.client.slides.presentations.pages.getThumbnail({
                                presentationId: slideId,
                                pageObjectId: slide.objectId
                            })
                            return teste
                        })
                    ).then(response => {
                        this.thumbnails = response.map(item => item.result.contentUrl)
                    })
                });
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
