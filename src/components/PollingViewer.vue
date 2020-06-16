<template>
    <div style="padding-top: 1rem">
        <Chart 
            :options="options"
            :chartdata="chartdata"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from '@/components/Chart.vue';
import Config from '@/config';
import { Util } from '@/util';

interface Dataset {
    label: string;
    data: number[];
    borderColor?: string;
    fill?: boolean;
    spanGaps?: boolean;
}

export default Vue.extend({
    name: "PollingViewer",
    components: {
        Chart
    },
    data() {
        return {
            polls: [],
            loading: true,
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
    mounted () {
        fetch(`${Config.baseUrl}/polls`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.loading = false;
                this.processPollResults(data.rows.reverse());
            });
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
