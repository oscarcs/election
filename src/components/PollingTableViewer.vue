<template>
    <div style="padding-top: 1rem">
        <b-table
            :data="polls"
            :narrowed="true"
            :hoverable="true"
            :loading="loading"
            header-class="is-charcoal has-text-white"
        >
            <template slot-scope="props">
                <b-table-column field="date" label="Ending Date">{{props.row.date | date}}</b-table-column>
                <b-table-column field="name" label="Poll Name">{{props.row.name}}</b-table-column>
                <b-table-column field="sample_size" label="Sample Size">{{props.row.sample_size}}</b-table-column>
                <b-table-column :header-class="cellStyle('lab')" field="lab" label="Labour" numeric>{{props.row.lab | round}}</b-table-column>
                <b-table-column :header-class="cellStyle('nat')" field="nat" label="National" numeric>{{props.row.nat | round}}</b-table-column>
                <b-table-column :header-class="cellStyle('nzf')" field="nzf" label="NZ First" numeric>{{props.row.nzf | round}}</b-table-column>
                <b-table-column :header-class="cellStyle('grn')" field="grn" label="Green" numeric>{{props.row.grn | round}}</b-table-column>
                <b-table-column :header-class="cellStyle('act')" field="act" label="ACT" numeric>{{props.row.act | round}}</b-table-column>
                <b-table-column :header-class="cellStyle('mri')" field="mri" label="Māori" numeric>{{props.row.mri | round}}</b-table-column>
                <b-table-column :header-class="cellStyle('ncp')" field="ncp" label="NC" numeric>{{props.row.ncp | round}}</b-table-column>
            </template>
        </b-table>
    </div>
</template>

<script lang="ts">
import moment from 'moment';
import PollingViewer from '@/components/PollingViewer';
import { Util } from '@/util';

export default PollingViewer.extend({
    name: "PollingTableViewer",
    components: { },
    data() {
        return {

        };
    },
    computed: {
        reversedPolls: function() {
            const x = this.polls.slice().reverse();
            console.log(x);
            return x;
        }
    },
    methods: {
        cellStyle: function(abbr: string): string {
            return `has-text-${Util.getPartyTextCSSName(abbr)}`;
        }
    },
    filters: {
        round: function(value: string) {
            if (!isNaN(parseFloat(value))) {
                return parseFloat(value).toFixed(1);
            }
            return value;
        },
        date: function(value: string) {
            return moment(value).format('DD MMMM');
        }
    }
});
</script>

<style lang="scss">
@import '@/styles/global.scss';

.table {
    color: $light;
    background-color: $slate;

    td {
        border-color: $charcoal;
    }

    th {
        border-color: $charcoal;
    }

    &.is-hoverable tbody tr:not(.is-selected):hover {
        color: $light;
        background-color: $charcoal;
    }

    thead {
        th {
            color: white;
        }
    }
}
</style>