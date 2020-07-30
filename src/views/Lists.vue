<template>
    <div class="tile is-ancestor">
        <div class="tile is-parent is-12">
            <article class="tile is-child notification is-slate">
                <p class="is-size-5">Party Lists</p>
                <p><i>The deadline for the political parties to submit their nominations for the party lists is 21 August.</i></p>
                <!-- <p><i>'Chances' estimates are a rough guide only, based on a very simplistic electorate swing model.</i></p> -->
                <b-field class="mt-1 mb-1" grouped>
                    <b-field>
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
                    </b-field>
                    <b-field horizontal>
                        <template slot="label">
                            <span style="white-space: nowrap; color: white;">Predicted number of seats:</span>
                        </template>
                        <b-input
                            v-model="currentSeats"
                            @input="calculateListData"
                            type="number"
                        ></b-input>
                    </b-field>
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
                                centered
                            >
                                {{getPartyName(props.row.winningParty)}}
                            </b-table-column>
                            <b-table-column numeric :style="props.row.marginStyle" field="margin" label="2017 Margin">
                                {{props.row.margin}}
                            </b-table-column>
                            <b-table-column
                                centered
                                :cell-class="props.row.likelihoodClass"
                                field="likelihood"
                                :label="`Likelihood of Election`"
                            >
                                {{props.row.likelihood}}
                            </b-table-column>
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

interface CandidateInfo {
    electorate: string;
    party: string;
    margin: number | 'new';
    winningParty: string;
}

export default Vue.extend({
    name: "Lists",
    components: {},
    computed: {
        likelihoods(): any {
            const l: any = {};
            const list = this.lists[this.selectedParty];

            let likelyElected = 0;

            for (const candidate of list) {
                l[candidate] = 0;

                const data = this.getCandidateData(candidate);
                if (data) {
                    if (data.winningParty === data.party) {
                        if (data.margin > 20) {
                            l[candidate] = 5;
                            likelyElected++;
                        }
                        else if (data.margin > 11) {
                            l[candidate] = 4;
                            likelyElected++;
                        }
                        else if (data.margin > 5) {
                            l[candidate] = 3;
                            likelyElected++;
                        }
                    } 
                    //@@TODO: make this more generic
                    else if (data.winningParty === 'nat' && data.party === 'lab') {
                        if (data.margin < 4.6) {
                            l[candidate] = 3;
                            likelyElected++;
                        }
                        else if (data.margin < 6) {
                            l[candidate] = 2;
                            likelyElected++;
                        }
                    }
                }
            }

            let remaining = this.currentSeats - likelyElected;

            if (remaining > 0) {                
                for (const candidate of list) {
                    remaining = this.currentSeats - likelyElected;

                    let newVal = 0;
                    if (remaining <= -6) {
                        newVal = 0;
                    }
                    else if (remaining <= -1) {
                        newVal = 1;
                    }
                    else if (remaining <= 2) {
                        newVal = 2;
                    }
                    else {
                        newVal = 3;
                    }

                    if (newVal > l[candidate]) {
                        likelyElected++;
                        l[candidate] = newVal;
                    }
    
                    if (remaining > 15) {
                        l[candidate] = 5;
                    }
                    else if (remaining > 10) {
                        l[candidate] = 4;
                    }
                }
            }

            for (const candidate of list) {
                switch (l[candidate]) {
                case 5: l[candidate] = 'Near Certain'; break;
                case 4: l[candidate] = 'Highly Likely'; break;
                case 3: l[candidate] = 'Likely'; break;
                case 2: l[candidate] = 'Fair'; break;
                case 1: l[candidate] = 'Unlikely'; break;
                case 0: l[candidate] = 'Highly Unlikely'; break;
                }
            }

            return l;
        }
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
                'lab': 67,
                'nat': 41,
                'grn': 6,
                'act': 6,
                'nzf': 0
            } as any,
            currentSeats: 67
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
            this.currentSeats = this.currentSeatDefaults[party];
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
                
                el.marginStyle = this.getMarginStyle(el.margin);
                el.likelihoodClass = this.getLikelihoodClass(el.likelihood);

                listData.push(el);
            }
            this.listData = listData;
        },

        getCandidateData(candidate: string): CandidateInfo | undefined {
            for (const electorate of Object.keys(this.electorates)) {
                for (const party of Object.keys(this.electorates[electorate])) {
                    if (Util.isParty(party)) {
                        if (this.electorates[electorate][party] === candidate) {

                            const margin = this.electorates[electorate]['margin'];

                            return {
                                electorate: electorate,
                                party: party,
                                margin: margin === 'new' ? 'new' : parseFloat(margin.split('+')[1]),
                                winningParty: margin === 'new' ? '—' : margin.split('/')[0] 
                            };
                        }
                    }
                }
            }

            return undefined;
        },

        getElectorateByCandidate(candidate: string): string {
            const res = this.getCandidateData(candidate);
            if (res) {
                return res.electorate;
            }
            return '';
        },

        getPartyByCandidate(candidate: string): string {
            const res = this.getCandidateData(candidate);
            if (res) {
                return res.party;
            }
            return '';
        },

        getMarginByCandidate(candidate: string): string {
            const res = this.getCandidateData(candidate);
            if (res) {
                return res.margin === 'new' ? 'New Electorate' : `${res.margin}%`;
            }
            return '';
        },

        getWinningPartyByCandidate(candidate: string): string {
            const res = this.getCandidateData(candidate);
            if (res) {
                return res.winningParty;
            }
            return '';
        },

        getLikelihoodByCandidate(candidate: string): string {
            return this.likelihoods[candidate];
        },

        getMarginStyle(margin: string): any {
            let c = 'white';
            const m = parseFloat(margin);
            if (!isNaN(m)) {
                let h;
                if (m > 15) {
                    h = 120;
                }
                else {
                    h = Math.round(((m / 15) * 45) / 15) * 15;
                }
                c = `hsl(${h}, 90%, 50%)`;
            }

            return {
                color: c
            };
        },

        getLikelihoodClass(likelihood: string) {
            return `has-text-${Util.getLikelihoodCSSName(likelihood)}`;
        }
    }
});
</script>
