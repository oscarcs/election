<template>
    <div class="pt-1">
        <Chart 
            :options="options"
            :chartdata="chartdata"
        />
    </div>
</template>

<script lang="ts">
import PollingViewer, { Dataset } from '@/components/PollingViewer';
import Chart from '@/components/Chart.vue';
import { Util } from '@/util';

export default PollingViewer.extend({
    name: "PollingChartViewer",
    components: {
        Chart
    },
    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: false
            },
            chartdata: {
                labels: [] as string[][],
                datasets: [] as Dataset[]
            }
        };
    },
    watch: {
        polls: function(polls, oldPolls) {
            if (polls.length !== oldPolls.length) {
                this.processPollResults(polls.splice(0, 9).reverse());
            }
        }
    },
    methods: {
        processPollResults(polls: any[]) {
            const datasets: Dataset[] = [];
            const labels: string[][] = [];

            for (const poll of polls) {
                labels.push([`to ${poll.date}`, `(${poll.name})`]);

                for (const party of Object.keys(poll)) {
                    if (!Util.isParty(party)) {
                        continue;
                    }

                    const dataset = datasets.find(x => x.label === party.toUpperCase());
                    let data = parseFloat(poll[party]);

                    if (typeof dataset === 'undefined') {
                        if (isNaN(data)) {
                            data = 0;
                        }
                        datasets.push({
                            label: party.toUpperCase(),
                            data: [data],
                            borderColor: Util.getPartyColor(party),
                            fill: false,
                            spanGaps: true
                        });
                    }
                    else {
                        dataset.data.push(data);
                    }
                }
            }

            this.chartdata = {
                labels: labels,
                datasets: datasets
            };
        }
    }
});
</script>
