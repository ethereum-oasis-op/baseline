import * as $ from "jquery";
import "bootstrap";

class Alerts {
    private delay = 2000;
    private alertsContainerHtml = '<div class="position-fixed"></div>';
    private alertHtml = `
    <div class="alert">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
    </div>`;

    error(message: string | string[], delay?: number): JQuery<HTMLElement> {
        return this.build('Error', message, 'alert-danger', delay);
    }

    success(message: string | string[], delay?: number): JQuery<HTMLElement> {
        return this.build('OK', message, 'alert-success', delay);
    }

    warn(message: string | string[], delay?: number): JQuery<HTMLElement> {
        return this.build('WARN', message, 'alert-warning', delay);
    }

    private build(type: string, message: string | string[], alerClass: string, delay?: number): JQuery<HTMLElement> {
        const alert = $(this.alertHtml);
        alert.append('<strong>'+ type +': </strong>');

        if (Array.isArray(message)) {
            message.forEach((val, index) => {
                const newline = index !== (message.length - 1) ? '<br/>' : '';
                alert.append('<span>'+ val +'</span>' + newline);
            });
        } else {
            alert.append('<span>'+ message +'</span>')
        }

        alert.addClass(alerClass)
            .appendTo(this.getAlertsContainer());
        setTimeout(() => { (<any>alert).alert('close') }, delay ?? this.delay);
        return alert;
    }

    private getAlertsContainer(): JQuery<HTMLElement> {
        const containerClass = "alerts-container";
        const retVal = $("." + containerClass + ":first");
        if (retVal.length) {
            return retVal;
        }

        return $(this.alertsContainerHtml).addClass(containerClass).appendTo($("body"));
    }
}

export const alerts = new Alerts();

export function spinnerOff() {
    $('#overlay').hide();
}

export function spinnerOn() {
    $('#overlay').show();
}