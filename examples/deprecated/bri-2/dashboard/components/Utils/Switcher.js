import Swal from 'sweetalert2';

export function AlertSwitcher(time, icon, title, messageHtml, buttonText) {

      let timerInterval;

        Swal.fire({
        title: title,
        icon: icon,
        html: messageHtml,
        confirmButtonText: buttonText ? buttonText : 'Ok',
        timer: time,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
            const content = Swal.getContent()
            if (content) {
                const b = content.querySelector('b')
                if (b) {
                b.textContent = Swal.getTimerLeft()
                }
            }
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
        }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            //console.log('I was closed by the timer')
            window.location.reload();
        }
        })

}