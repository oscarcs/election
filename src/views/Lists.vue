<template>
    <div class="tile is-ancestor">
        <div class="tile is-parent is-12">
            <article class="tile is-child notification is-slate">
                <p class="is-size-5">Party Lists</p>
                <p>The deadline for the political parties to submit their nominations for the party lists is 21 August.</p>
                <b-dropdown class="mt-1 mb-1">
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
                <div>
                    <!-- <p class="is-size-5">Party List for {{getPartyName(selectedParty)}}</p> -->
                    <div class="mt-1">
                        <div class="notification is-charcoal partylist" v-for="(member, spot) of lists[selectedParty]" :key="member">
                            {{spot + 1}} — {{member}}
                        </div>
                    </div>
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
            lists: {},
            selectedParty: 'lab'
        };
    },
    mounted () {
        fetch(`${Config.baseUrl}/lists`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.lists = data;
            });
    },
    methods: {
        getPartyName: function(abbr: string): string {
            return Util.getPartyName(abbr);
        },

        getPartyCSSName: function(abbr: string): string {
            return Util.getPartyCSSName(abbr);
        },

        changeSelectedParty: function(party: string) {
            this.selectedParty = party;
        }
    }
});
</script>

<style lang="scss">
.partylist {
    display: inline-block;
    margin-right: 1.5rem;
}
</style>
