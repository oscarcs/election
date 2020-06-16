<script lang="ts">
import Vue from 'vue';
import { Line } from 'vue-chartjs';

export default Vue.extend({
    extends: Line,
    props: {
        chartdata: {
            type: Object,
            default: null
        },
        options: {
            type: Object,
            default: null
        }
    },
    watch: {
        chartdata: function(chartdata) {
            // eslint-disable-next-line
            (this as any).renderChart(chartdata, this.options);
        },
        options: function(options) {
            // eslint-disable-next-line
            (this as any).renderChart(this.chartdata, options);
        }
    },
    methods: {
    }
});
</script>