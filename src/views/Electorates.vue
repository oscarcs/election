<template>
    <div class="tile is-ancestor">
        <div class="tile is-parent is-12">
            <article class="tile is-child notification is-slate">
                <p class="is-size-5">Electorates</p>

            </article>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Config from '@/config';

export default Vue.extend({
    name: "Electorates",
    components: {},
    computed: {
        
    },
    data: function() {
        return {
            
        };
    },
    mounted () {
        fetch(`${Config.baseUrl}/electorates`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
            });
    }
});
</script>
