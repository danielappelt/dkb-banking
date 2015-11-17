var casper = require('casper').create(),
    utils = require('utils');

casper.start('https://banking.dkb.de');

casper.waitForSelector('form#login', function() {
//    this.debugHTML('#login');
    this.fillSelectors('#login', {
        'input[name="j_username"]': this.cli.args[0],
        'input[name="j_password"]': this.cli.args[1]
    }, true);
});

casper.waitForSelector('ul.navigationMain', function() {
//    // Print out current status
//    this.debugHTML('.financialStatusTable');

    this.echo('Open letter box..');
    this.click('#menu_3-node a');
});

casper.waitForSelector('#documentsTableOverview_outer', function() {
//    this.echo(this.evaluate(function() {
//        return document.getElementsByTagName('h1')[0].textContent;
//    }));

//    this.debugHTML('#documentsTableOverview_outer tbody tr');

    this.echo('Fetch new letters..');
    this.each(this.evaluate(function() {
        var tr = document.querySelectorAll('#documentsTableOverview_outer tbody tr'),
            result = [], i, len;

        for(i = 0, len = tr.length; i < len; i++) {
            // Names of unread letters are enclosed in strong tags 
            if(tr[i].querySelectorAll('strong').length) {
                result.push({
                    name: tr[i].querySelectorAll('td:nth-child(3)')[0].textContent.trim(),
                    url: tr[i].querySelectorAll('td:last-child a')[1].href
                });
            }
        }

        return result;
    }), function(self, letter) {
        self.echo(letter.name);
        self.download(letter.url, (this.cli.args[2] || '/tmp/') + letter.name + '.pdf');
    });
});

casper.run();
