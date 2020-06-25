<template>
    <div class="tile is-ancestor">
        <div class="tile is-parent is-12">
            <article class="tile is-child notification is-slate">
                <p class="is-size-5">Party Lists</p>
                <p><i>The deadline for the political parties to submit their nominations for the party lists is 21 August.</i></p>
                <!-- <p><i>'Chances' estimates are a rough guide only, based on a very simplistic electorate swing model.</i></p> -->
                <b-field class="mt-1 mb-1">
                    <p class="control">
                        <b-dropdown>
                            <button class="button" :class="[`is-${getPartyCSSName(selectedParty)}`]" slot="trigger" slot-scope="{ active }">
                                <span class="mr-1">{{getPartyName(selectedParty)}}</span>
                                <ion-icon
                                    :name="active ? 'chevron-up-outline' : 'chevron-down-outline'"
                                ></ion-icon>
                            </button>
                            <b-dropdown-item v-for="party of Object.keys(lists)" :key="party" @click="changeSelectedParty(party)">
                                {{getPartyName(party)}} ({{lists[party].length}})
                            </b-dropdown-item>
                        </b-dropdown>
                    </p>
                    <!-- <b-input
                        placeholder="Estimated Number of Seats"
                        v-model="currentSeats"
                        @input="calculateListData"
                    ></b-input> -->
                </b-field>
                <div class="dark">
                    <b-table
                        :data="listData"
                        :narrowed="true"
                        :hoverable="true"
                        :loading="loading"
                        header-class="is-charcoal has-text-white"
                    >
                        <template slot-scope="props">
                            <b-table-column field="number" label="#">{{props.row.number}}</b-table-column>
                            <b-table-column field="name" label="Name">{{props.row.name}}</b-table-column>
                            <b-table-column field="electorate" label="Electorate">{{props.row.electorate}}</b-table-column>
                            <b-table-column
                                :cell-class="`has-text-${getPartyTextCSSName(props.row.winningParty)}`"
                                field="winningParty"
                                label="2017 Winner"
                            >
                                {{getPartyName(props.row.winningParty)}}
                            </b-table-column>
                            <b-table-column :cell-class="props.row.marginClass" field="margin" label="2017 Margin">
                                {{props.row.margin}}
                            </b-table-column>
                            <!-- <b-table-column :cell-class="props.row.likelihoodClass" field="likelihood" :label="`Chances`">
                                {{props.row.likelihood}}
                            </b-table-column> -->
                        </template>
                    </b-table>
                </div>
            </article>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Config from '@/config';
import { Util } from '@/util';

export default Vue.extend({
    name: "Lists",
    components: {},
    computed: {

    },
    data: function() {
        return {
            loading: false,
            lists: {} as any,
            listData: [] as any[],
            electorates: {} as any,
            selectedParty: 'lab',
            
            //@@TODO: calculate this from polling data!
            currentSeatDefaults: {
                'lab': 62,
                'nat': 47,
                'grn': 7,
                'act': 4,
                'nzf': 0
            } as any,
            currentSeats: 60,
        };
    },
    mounted () {
        this.loading = true;
        fetch(`${Config.baseUrl}/lists`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.loading = false;
                this.lists = data;
                this.calculateListData();
            });
        fetch(`${Config.baseUrl}/electorates`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.electorates = data;
                this.calculateListData();
            });
    },
    methods: {
        getPartyName: function(abbr: string): string {
            return Util.getPartyName(abbr);
        },

        getPartyCSSName: function(abbr: string): string {
            return Util.getPartyCSSName(abbr);
        },

        getPartyTextCSSName: function(abbr: string): string {
            return Util.getPartyTextCSSName(abbr);
        },

        changeSelectedParty: function(party: string) {
            this.selectedParty = party;
            this.currentSeats = this.currentSeatDefaults[this.selectedParty];
            this.calculateListData();
        },

        calculateListData() {
            const listData = [];
            for (const i in this.lists[this.selectedParty]) {
                const candidate = this.lists[this.selectedParty][i]; 
                const el: any = {
                    number: parseInt(i) + 1,
                    name: candidate,
                    electorate: this.getElectorateByCandidate(candidate),
                    winningParty: this.getWinningPartyByCandidate(candidate),
                    margin: this.getMarginByCandidate(candidate),
                    likelihood: this.getLikelihoodByCandidate(candidate),
                };
                
                el.marginClass = this.getMarginClassByMargin(el.margin);
                el.likelihoodClass = this.getLikelihoodClassByLikelihood(el.likelihood);

                listData.push(el);
            }
            this.listData = listData;
        },

        getElectorateByCandidate(candidate: string): string {
            for (const electorate of Object.keys(this.electorates)) {
                for (const party of Object.keys(this.electorates[electorate])) {
                    if (Util.isParty(party)) {
                        if (this.electorates[electorate][party] === candidate) {
                            return electorate;
                        }
                    }
                }
            }
            return '';
        },

        getMarginByCandidate(candidate: string): string {
            const res = this.getElectorateByCandidate(candidate);
            if (res !== '') {
                const margin = this.electorates[res]['margin'];
                if (margin === 'new') {
                    return 'New Electorate';
                }
                else {
                    const marginPct = margin.split('+')[1];
                    return Util.getPartyName(marginPct) + '%';
                }
            }
            return '';
        },

        getWinningPartyByCandidate(candidate: string): string {
            const res = this.getElectorateByCandidate(candidate);
            if (res !== '') {
                const margin = this.electorates[res]['margin'];
                if (margin === 'new') {
                    return '—';
                }
                else {
                    const party = margin.split('/')[0];
                    return party;
                }
            }
            return '';
        },

        getLikelihoodByCandidate(candidate: string): string {
            return 'Fair';
        },

        getMarginClassByMargin(margin: string): string {
            let c = 'has-text-light';
            const m = parseFloat(margin);
            if (!isNaN(m)) {
                c = 'has-text-';
                if (m > 20) {
                    c += Util.getLikelihoodCSSName('near certain');
                }
                else if (m > 12) {
                    c += Util.getLikelihoodCSSName('likely');
                }
                else if (m > 7.5) {
                    c += Util.getLikelihoodCSSName('fair');
                }
                else if (m > 5.5) {
                    c += Util.getLikelihoodCSSName('unlikely');
                }
                else {
                    c += Util.getLikelihoodCSSName('highly unlikely');
                }
            }
            return c;
        },

        getLikelihoodClassByLikelihood(likelihood: string) {
            return `has-text-${Util.getLikelihoodCSSName(likelihood)}`;
        }
    }
});
</script>
