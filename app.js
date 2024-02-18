document.addEventListener('alpine:init', () => {
    Alpine.data('list', () => {
        return {
            sets: [],
            type: 'expansion',
            search: '',

            init () {
                const data = window.localStorage.getItem('sets');

                if (data) {
                    console.log("Initializing with cached data!");

                    this.sets = JSON.parse(data);

                    return;
                }

                console.log('Cached missed!')

                this.fetchData();
            },

            get filteredSets () {
                return this.sets.filter((s) => {
                    const search = this.search.toLowerCase();

                    if (search) {
                        if (s.name.toLowerCase().indexOf(search) < 0 && !s.code.toLowerCase().startsWith(search)) {
                            return false;
                        }
                    }

                    if (this.type !== '*' && s.set_type !== this.type) {
                        return false;
                    }

                    return true;
                });
            },

            clearCache () {
                window.localStorage.removeItem('sets');
                this.fetchData();
            },

            fetchData () {
                console.log("Fetching new data from Scryfall...");

                fetch('https://api.scryfall.com/sets')
                    .then((r) => r.json())
                    .then((j) => {
                        this.sets = j.data;

                        // Cache for later:
                        window.localStorage.setItem('sets', JSON.stringify(j.data));
                    });
            }
        };
    });
});
