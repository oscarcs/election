<template>
    <div class="tile is-ancestor">
        <div class="tile is-parent is-12">
            <article class="tile is-child notification is-slate">
                <p class="is-size-5">Party Lists</p>
                <p>The deadline for the political parties to submit their nominations for the party lists is 21 August.</p>
                <select>
                    <option></option>
                </select>
            </article>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Config from '@/config';

export default Vue.extend({
    name: "Lists",
    components: {},
    computed: {

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
