import Vue from 'vue';
import Config from '@/config';

export interface Dataset {
    label: string;
    data: number[];
    borderColor?: string;
    fill?: boolean;
    spanGaps?: boolean;
}

export default Vue.extend({
    data() {
        return {
            polls: [],
            loading: true
        };
    },
    mounted () {
        fetch(`${Config.baseUrl}/polls`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.loading = false;
                this.polls = data.rows;
            });
    },
    methods: {

    }
});