<template>
    <div class="tile is-ancestor">
        <div class="tile is-parent is-12">
            <article class="tile is-child notification is-slate">
                <p class="is-size-5">Polling</p>
                <b-switch
                    v-model="mode"
                    true-value="chart"
                    false-value="table"
                    style="text-transform: capitalize;"
                    class="mt-1"
                    outlined="false"
                    type="is-white"
                    passive-type="is-white"
                >{{mode}}</b-switch>
                <PollingChartViewer v-if="mode === 'chart'" />
                <PollingTableViewer v-if="mode === 'table'" />
            </article>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PollingChartViewer from '@/components/PollingChartViewer.vue';
import PollingTableViewer from '@/components/PollingTableViewer.vue';

export default Vue.extend({
    name: "Polling",
    components: { PollingChartViewer, PollingTableViewer },
    data() {
        return {
            mode: 'table'
        };
    },
});
</script>
